export interface Resource {
  image_url: string;
  resource_type: string;
  count: number;
  amount_spent: number;
  compliance_percentage: number;
}

export enum SidebarContentComponents {
  AllResourcesInSidebar,
  OneDetailedResourcesInSidebar,
}
