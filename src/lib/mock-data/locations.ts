// South Africa — provinces and cities
export const SA_LOCATIONS: Record<string, string[]> = {
  "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Centurion", "Midrand"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Ladysmith"],
  "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "George", "Worcester"],
  "Eastern Cape": ["Gqeberha (PE)", "East London", "Mthatha", "King William's Town"],
  "Limpopo": ["Polokwane", "Tzaneen", "Mokopane", "Louis Trichardt"],
  "Mpumalanga": ["Nelspruit", "Witbank", "Secunda", "Standerton"],
  "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem"],
  "North West": ["Rustenburg", "Mahikeng", "Klerksdorp", "Potchefstroom"],
  "Northern Cape": ["Kimberley", "Upington", "Springbok", "De Aar"],
};

// Zimbabwe — provinces and cities
export const ZW_LOCATIONS: Record<string, string[]> = {
  "Harare Province": ["Harare", "Chitungwiza"],
  "Bulawayo Province": ["Bulawayo"],
  "Manicaland": ["Mutare", "Chipinge", "Rusape", "Nyanga"],
  "Mashonaland Central": ["Bindura", "Shamva", "Centenary"],
  "Mashonaland East": ["Marondera", "Mutoko", "Wedza"],
  "Mashonaland West": ["Chinhoyi", "Karoi", "Kadoma"],
  "Masvingo": ["Masvingo", "Zvishavane", "Triangle"],
  "Matabeleland North": ["Hwange", "Victoria Falls", "Binga"],
  "Matabeleland South": ["Gwanda", "Beitbridge", "Plumtree"],
  "Midlands": ["Gweru", "Kwekwe", "Shurugwi"],
};

export const ALL_LOCATIONS = {
  ZA: SA_LOCATIONS,
  ZW: ZW_LOCATIONS,
};
