export default interface ICommunityPersistence {
    id: string;
    name: string;
    description: string;
    country?: string; // Optional field for country
    countryCode?: string; // Optional field for country code
}