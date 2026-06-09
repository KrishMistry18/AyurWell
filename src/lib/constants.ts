export interface DoshaInfo {
  name: string;
  color: string;
  description: string;
  qualities: string[];
}

export const DOSHA_DATA: Record<string, DoshaInfo> = {
  vata: {
    name: 'Vata',
    color: '#7B9CBF',
    description: 'Associated with air and space. Controls movement, breathing, and blood flow.',
    qualities: ['Light', 'Cold', 'Dry', 'Rough', 'Mobile', 'Subtle']
  },
  pitta: {
    name: 'Pitta',
    color: '#E07A5F',
    description: 'Associated with fire and water. Governs metabolism, digestion, and energy production.',
    qualities: ['Hot', 'Sharp', 'Light', 'Liquid', 'Spreading', 'Oily']
  },
  kapha: {
    name: 'Kapha',
    color: '#6B8F71',
    description: 'Associated with earth and water. Governs structure, fluid balance, and stability.',
    qualities: ['Heavy', 'Slow', 'Steady', 'Solid', 'Cold', 'Oily']
  }
};

export interface SeasonInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  ayurvedicFocus: string;
  months: string;
}

export const SEASON_DATA: Record<string, SeasonInfo> = {
  spring: {
    id: 'spring',
    name: 'Spring',
    emoji: '🌸',
    description: 'A time of renewal, warmth, and moisture as the earth awakens from winter.',
    ayurvedicFocus: 'Kapha balancing. Focus on light, dry, and warming foods to counter seasonal congestion.',
    months: 'March - May'
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    emoji: '☀️',
    description: 'Hot, bright, and sharp energy. Days are long and the sun is at its peak.',
    ayurvedicFocus: 'Pitta balancing. Emphasize cooling, sweet, and hydrating foods to prevent overheating.',
    months: 'June - August'
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    emoji: '🍁',
    description: 'Cool, dry, and windy conditions. Transition period from heat to cold.',
    ayurvedicFocus: 'Vata balancing. Favor warm, moist, grounding foods and root vegetables to maintain stability.',
    months: 'September - November'
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    emoji: '❄️',
    description: 'Cold, heavy, and dark period where nature rests and gathers strength.',
    ayurvedicFocus: 'Vata and Kapha balancing. Enjoy warm, nourishing, spicy foods and hot drinks.',
    months: 'December - February'
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
