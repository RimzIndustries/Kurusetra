/**
 * Network utilities for efficient data serialization and transport
 */

// Define message types for serialization
export enum MessageType {
  GAME_STATE_UPDATE = "GAME_STATE_UPDATE",
  PLAYER_ACTION = "PLAYER_ACTION",
  ATTACK_RESULT = "ATTACK_RESULT",
  ERROR = "ERROR",
  PING = "PING",
  PONG = "PONG",
}

// Base message interface
interface BaseMessage {
  type: MessageType;
  timestamp: number;
  messageId: string;
}

// Game state update message
export interface GameStateUpdateMessage extends BaseMessage {
  type: MessageType.GAME_STATE_UPDATE;
  payload: {
    kingdomId: string;
    resources: any;
    buildings: any;
    troops: any;
    attacks: any;
    partial: boolean; // Whether this is a partial or full update
  };
}

// Player action message
export interface PlayerActionMessage extends BaseMessage {
  type: MessageType.PLAYER_ACTION;
  payload: {
    actionType: string;
    kingdomId: string;
    data: any;
  };
}

// Attack result message
export interface AttackResultMessage extends BaseMessage {
  type: MessageType.ATTACK_RESULT;
  payload: {
    attackId: string;
    success: boolean;
    details: any;
  };
}

// Error message
export interface ErrorMessage extends BaseMessage {
  type: MessageType.ERROR;
  payload: {
    code: string;
    message: string;
    details?: any;
  };
}

// Ping message for latency testing
export interface PingMessage extends BaseMessage {
  type: MessageType.PING;
  payload: {
    pingId: string;
  };
}

// Pong response to ping
export interface PongMessage extends BaseMessage {
  type: MessageType.PONG;
  payload: {
    pingId: string;
    serverTime: number;
  };
}

// Union type for all message types
export type NetworkMessage =
  | GameStateUpdateMessage
  | PlayerActionMessage
  | AttackResultMessage
  | ErrorMessage
  | PingMessage
  | PongMessage;

/**
 * Serializes a message for network transport
 * Uses JSON for simplicity, but could be replaced with a more efficient
 * binary format like Protocol Buffers or MessagePack in production
 */
export function serializeMessage(message: NetworkMessage): string {
  // Add timestamp if not present
  if (!message.timestamp) {
    message.timestamp = Date.now();
  }

  // Add message ID if not present
  if (!message.messageId) {
    message.messageId = generateMessageId();
  }

  return JSON.stringify(message);
}

/**
 * Deserializes a message from network transport
 */
export function deserializeMessage(data: string): NetworkMessage {
  try {
    const message = JSON.parse(data) as NetworkMessage;
    return message;
  } catch (error) {
    // If parsing fails, return an error message
    return {
      type: MessageType.ERROR,
      timestamp: Date.now(),
      messageId: generateMessageId(),
      payload: {
        code: "PARSE_ERROR",
        message: "Failed to parse message",
        details: { originalData: data },
      },
    };
  }
}

/**
 * Generates a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Compresses game state updates to reduce bandwidth
 * Only sends changed fields compared to previous state
 */
export function createDeltaUpdate(previousState: any, currentState: any): any {
  const delta: any = {};

  // Compare and only include changed fields
  for (const key in currentState) {
    if (!previousState || !isEqual(previousState[key], currentState[key])) {
      delta[key] = currentState[key];
    }
  }

  return delta;
}

/**
 * Deep equality check for objects
 */
function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Measures network latency
 */
export class LatencyTracker {
  private pingHistory: number[] = [];
  private maxHistorySize = 10;
  private pingCallbacks: Map<string, (latency: number) => void> = new Map();

  /**
   * Creates a ping message to measure latency
   */
  createPing(callback?: (latency: number) => void): PingMessage {
    const pingId = `ping_${Date.now()}`;

    if (callback) {
      this.pingCallbacks.set(pingId, callback);
    }

    return {
      type: MessageType.PING,
      timestamp: Date.now(),
      messageId: generateMessageId(),
      payload: {
        pingId,
      },
    };
  }

  /**
   * Creates a pong response to a ping
   */
  createPong(pingMessage: PingMessage): PongMessage {
    return {
      type: MessageType.PONG,
      timestamp: Date.now(),
      messageId: generateMessageId(),
      payload: {
        pingId: pingMessage.payload.pingId,
        serverTime: Date.now(),
      },
    };
  }

  /**
   * Processes a pong response and calculates latency
   */
  processPong(pongMessage: PongMessage): number {
    const pingId = pongMessage.payload.pingId;
    const now = Date.now();
    const pingTime = parseInt(pingId.split("_")[1]);
    const latency = now - pingTime;

    // Add to history
    this.pingHistory.push(latency);
    if (this.pingHistory.length > this.maxHistorySize) {
      this.pingHistory.shift();
    }

    // Call callback if exists
    const callback = this.pingCallbacks.get(pingId);
    if (callback) {
      callback(latency);
      this.pingCallbacks.delete(pingId);
    }

    return latency;
  }

  /**
   * Gets the average latency from recent pings
   */
  getAverageLatency(): number {
    if (this.pingHistory.length === 0) return 0;

    const sum = this.pingHistory.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / this.pingHistory.length);
  }

  /**
   * Clears ping history
   */
  clearHistory(): void {
    this.pingHistory = [];
    this.pingCallbacks.clear();
  }
}

// Export a singleton instance of the latency tracker
export const latencyTracker = new LatencyTracker();

/**
 * Handles message retries for important messages
 */
export class MessageRetryHandler {
  private pendingMessages: Map<
    string,
    {
      message: NetworkMessage;
      attempts: number;
      maxAttempts: number;
      lastAttempt: number;
      onSuccess?: () => void;
      onFailure?: (error: string) => void;
    }
  > = new Map();

  private retryInterval: number = 3000; // 3 seconds
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start checking for messages to retry
    this.checkInterval = setInterval(() => this.checkPendingMessages(), 1000);
  }

  /**
   * Adds a message to be retried if no acknowledgement is received
   */
  addMessage(
    message: NetworkMessage,
    maxAttempts: number = 3,
    onSuccess?: () => void,
    onFailure?: (error: string) => void,
  ): void {
    this.pendingMessages.set(message.messageId, {
      message,
      attempts: 1, // First attempt is the initial send
      maxAttempts,
      lastAttempt: Date.now(),
      onSuccess,
      onFailure,
    });
  }

  /**
   * Marks a message as acknowledged (successful)
   */
  acknowledgeMessage(messageId: string): void {
    const pendingMessage = this.pendingMessages.get(messageId);
    if (pendingMessage && pendingMessage.onSuccess) {
      pendingMessage.onSuccess();
    }
    this.pendingMessages.delete(messageId);
  }

  /**
   * Checks for messages that need to be retried
   */
  private checkPendingMessages(): void {
    const now = Date.now();

    this.pendingMessages.forEach((data, messageId) => {
      // Check if it's time to retry
      if (now - data.lastAttempt >= this.retryInterval) {
        // Check if we've reached max attempts
        if (data.attempts >= data.maxAttempts) {
          // Max attempts reached, call failure callback
          if (data.onFailure) {
            data.onFailure("Max retry attempts reached");
          }
          this.pendingMessages.delete(messageId);
        } else {
          // Retry the message
          data.attempts++;
          data.lastAttempt = now;

          // The actual retry logic would be implemented by the consumer
          // This class just tracks the state and calls the callbacks
        }
      }
    });
  }

  /**
   * Gets pending messages that need to be retried
   */
  getPendingRetries(): NetworkMessage[] {
    const retries: NetworkMessage[] = [];
    const now = Date.now();

    this.pendingMessages.forEach((data) => {
      if (
        now - data.lastAttempt >= this.retryInterval &&
        data.attempts < data.maxAttempts
      ) {
        retries.push(data.message);
      }
    });

    return retries;
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Export a singleton instance of the message retry handler
export const messageRetryHandler = new MessageRetryHandler();
