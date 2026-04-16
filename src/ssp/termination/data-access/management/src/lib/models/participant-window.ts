export interface ParticipantWindow extends Window {
  apis: {
    termModelContent: string;
    participantGrantDetails: string;
    learnMoreLink: string;
    termRuleIds: string;
    content: string;
    participantWid: string;
    employmentdetails: string;
  };
  config: {
    pageContext: string;
    participantFeatureContext: string;
    participantIndicativeDataApiUri: string;
    pageContextUser: string;
    participantHeaderURI: string;
    expandedSections: string;
    spsClientId?: string; // Optional property for SPS Client ID
  };
  isTocV2Available?: boolean; // Optional property to indicate if TOC V2 is available
}
