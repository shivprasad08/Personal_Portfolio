export const LINKEDIN_PROFILE = process.env.NEXT_PUBLIC_LINKEDIN_PROFILE || "https://www.linkedin.com/in/shivprasad-mahind08/"
export const LINKEDIN_IMAGE = process.env.NEXT_PUBLIC_LINKEDIN_IMAGE || ""

// Helper to choose image: prefer LinkedIn image if provided, otherwise empty string
export const getLinkedInImage = () => {
  return LINKEDIN_IMAGE || ""
}

export default {
  LINKEDIN_PROFILE,
  LINKEDIN_IMAGE,
  getLinkedInImage,
}
