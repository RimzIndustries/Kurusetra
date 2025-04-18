import React from 'react';
import styled from 'styled-components';
import { ZodiacSign } from '../types/game';
import {
  NeumorphicCard,
  NeumorphicList,
  NeumorphicListItem,
  NeumorphicBadge
} from '../styles/components';

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const Title = styled.h3`
  color: ${props => props.theme.accent};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const BonusList = styled(NeumorphicList)`
  margin: 1rem 0;
`;

const BonusItem = styled(NeumorphicListItem)`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  color: ${props => props.theme.text};

  &::before {
    content: '✨';
    margin-right: 0.5rem;
  }
`;

const Specialization = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.secondary};
  border-radius: 10px;
  border-left: 4px solid ${props => props.theme.accent};
`;

interface RaceZodiacInfoProps {
  race: string;
  zodiac: ZodiacSign;
}

export const RaceZodiacInfo: React.FC<RaceZodiacInfoProps> = ({ race, zodiac }) => {
  const getRaceInfo = (race: string) => {
    switch (race) {
      case 'ksatriya':
        return {
          title: 'Ksatriya',
          description: 'Ras yang mengutamakan pengetahuan dan efisiensi ekonomi.',
          bonuses: [
            '+30% kecepatan riset',
            '+30% efisiensi ekonomi',
            'Akses ke teknologi canggih'
          ],
          specialization: 'Kerajaan berbasis pengetahuan dan ekonomi'
        };
      case 'wanamarta':
        return {
          title: 'Wanamarta',
          description: 'Ras yang menguasai sihir dan ritual gelap.',
          bonuses: [
            '+50% kekuatan sihir',
            'Akses ke ritual gelap',
            'Kemampuan manipulasi energi'
          ],
          specialization: 'Kerajaan berbasis sihir dan ritual'
        };
      case 'wirabumi':
        return {
          title: 'Wirabumi',
          description: 'Ras yang ahli dalam konstruksi dan pertambangan.',
          bonuses: [
            '+40% kecepatan konstruksi',
            '+40% produksi tambang',
            'Struktur tahan gempa'
          ],
          specialization: 'Kerajaan berbasis industri dan konstruksi'
        };
      case 'jatayu':
        return {
          title: 'Jatayu',
          description: 'Ras yang menguasai langit dan serangan cepat.',
          bonuses: [
            'Pasukan terbang',
            'Waktu serang 50% lebih cepat',
            'Mobilitas tinggi'
          ],
          specialization: 'Kerajaan udara dan serangan kilat'
        };
      case 'kurawa':
        return {
          title: 'Kurawa',
          description: 'Ras yang ahli dalam pencurian dan sabotase.',
          bonuses: [
            'Bisa mencuri sumber daya lawan',
            'Kemampuan sabotase',
            'Operasi rahasia'
          ],
          specialization: 'Kerajaan bawah tanah dan operasi rahasia'
        };
      case 'tibrasara':
        return {
          title: 'Tibrasara',
          description: 'Ras yang mengutamakan pertahanan dan pemanah.',
          bonuses: [
            '+60% pertahanan',
            'Pasukan pemanah elite',
            'Pertahanan berlapis'
          ],
          specialization: 'Kerajaan bertahan dan pemanah'
        };
      case 'raksasa':
        return {
          title: 'Raksasa',
          description: 'Ras yang memiliki kekuatan fisik luar biasa.',
          bonuses: [
            '+75% kekuatan serang fisik',
            'Kapasitas pasukan besar',
            'Ketahanan tinggi'
          ],
          specialization: 'Kerajaan kekuatan dan jumlah'
        };
      case 'dedemit':
        return {
          title: 'Dedemit',
          description: 'Ras yang tidak membutuhkan makanan dan abadi.',
          bonuses: [
            'Tidak butuh makanan',
            'Pasukan abadi',
            'Regenerasi cepat'
          ],
          specialization: 'Kerajaan abadi dan regenerasi'
        };
      default:
        return {
          title: 'Unknown Race',
          description: 'No information available.',
          bonuses: [],
          specialization: ''
        };
    }
  };

  const getZodiacInfo = (zodiac: ZodiacSign) => {
    switch (zodiac) {
      case 'aries':
        return {
          title: 'Aries (Domba Api)',
          description: 'Zodiak yang mengutamakan serangan cepat dan moral tinggi.',
          bonuses: [
            '+40% kecepatan serangan pertama',
            'Moral tinggi di awal pertempuran',
            'Penaklukan wilayah cepat'
          ],
          specialization: 'Serangan kilat dan penaklukan'
        };
      case 'taurus':
        return {
          title: 'Taurus (Banteng)',
          description: 'Zodiak yang fokus pada ekonomi dan pertahanan.',
          bonuses: [
            '+50% produksi sumber daya',
            '+30% pertahanan',
            'Ekonomi kuat'
          ],
          specialization: 'Ekonomi dan pertahanan'
        };
      case 'gemini':
        return {
          title: 'Gemini (Kembar)',
          description: 'Zodiak yang bisa melakukan banyak hal sekaligus.',
          bonuses: [
            'Bisa membangun dua struktur',
            'Bisa melatih dua pasukan',
            'Diplomasi fleksibel'
          ],
          specialization: 'Multitasking dan diplomasi'
        };
      case 'cancer':
        return {
          title: 'Cancer (Kepiting)',
          description: 'Zodiak yang ahli dalam pertahanan wilayah.',
          bonuses: [
            '+35% pertahanan di wilayah sendiri',
            'Regenerasi pasukan cepat',
            'Perang psikologis'
          ],
          specialization: 'Pertahanan dan regenerasi'
        };
      case 'leo':
        return {
          title: 'Leo (Singa)',
          description: 'Zodiak yang memiliki aura kepemimpinan kuat.',
          bonuses: [
            '+25% kekuatan pasukan saat dipimpin',
            'Moral aliansi tinggi',
            'Serangan spektakuler'
          ],
          specialization: 'Kepemimpinan dan moral'
        };
      case 'virgo':
        return {
          title: 'Virgo (Perawan)',
          description: 'Zodiak yang mengutamakan teknologi dan presisi.',
          bonuses: [
            '+40% kecepatan riset',
            'Efisiensi sumber daya',
            'Pasukan presisi tinggi'
          ],
          specialization: 'Teknologi dan presisi'
        };
      case 'libra':
        return {
          title: 'Libra (Timbangan)',
          description: 'Zodiak yang ahli dalam diplomasi dan penyeimbangan.',
          bonuses: [
            'Pencurian sumber daya seimbang',
            '+30% diplomasi',
            'Penyeimbang perang'
          ],
          specialization: 'Diplomasi dan penyeimbangan'
        };
      case 'scorpio':
        return {
          title: 'Scorpio (Kalajengking)',
          description: 'Zodiak yang ahli dalam operasi rahasia.',
          bonuses: [
            '+50% efektivitas operasi rahasia',
            'Serangan balik mematikan',
            'Perang asimetris'
          ],
          specialization: 'Operasi rahasia dan serangan balik'
        };
      case 'sagittarius':
        return {
          title: 'Sagittarius (Pemanah)',
          description: 'Zodiak yang ahli dalam serangan jarak jauh.',
          bonuses: [
            '+50% akurasi pemanah',
            'Eksplorasi peta 2x lebih cepat',
            'Pengintaian efektif'
          ],
          specialization: 'Serangan jarak jauh dan pengintaian'
        };
      case 'capricorn':
        return {
          title: 'Capricorn (Kambing Laut)',
          description: 'Zodiak yang kuat di medan terjal.',
          bonuses: [
            '+60% kecepatan konstruksi di pegunungan',
            'Pasukan kuat di medan terjal',
            'Ekspansi berbasis geografi'
          ],
          specialization: 'Konstruksi dan medan terjal'
        };
      case 'aquarius':
        return {
          title: 'Aquarius (Pembawa Air)',
          description: 'Zodiak yang inovatif dan adaptif.',
          bonuses: [
            'Riset inovatif',
            'Adaptasi cuaca',
            'Senjata unik'
          ],
          specialization: 'Inovasi dan adaptasi'
        };
      case 'pisces':
        return {
          title: 'Pisces (Ikan)',
          description: 'Zodiak yang ahli dalam ilusi dan regenerasi.',
          bonuses: [
            'Sumber daya regeneratif',
            'Ilusi magis',
            'Ekonomi berkelanjutan'
          ],
          specialization: 'Ilusi dan regenerasi'
        };
    }
  };

  const raceInfo = getRaceInfo(race);
  const zodiacInfo = getZodiacInfo(zodiac);

  return (
    <InfoContainer>
      <NeumorphicCard>
        <Title>{raceInfo.title}</Title>
        <Description>{raceInfo.description}</Description>
        <BonusList>
          {raceInfo.bonuses.map((bonus, index) => (
            <BonusItem key={index}>{bonus}</BonusItem>
          ))}
        </BonusList>
        <Specialization>
          <strong>Spesialisasi:</strong> {raceInfo.specialization}
        </Specialization>
      </NeumorphicCard>

      <NeumorphicCard>
        <Title>{zodiacInfo.title}</Title>
        <Description>{zodiacInfo.description}</Description>
        <BonusList>
          {zodiacInfo.bonuses.map((bonus, index) => (
            <BonusItem key={index}>{bonus}</BonusItem>
          ))}
        </BonusList>
        <Specialization>
          <strong>Spesialisasi:</strong> {zodiacInfo.specialization}
        </Specialization>
      </NeumorphicCard>
    </InfoContainer>
  );
}; 