/**
 * Template sets API for fetching available agent templates
 * Manual implementation until OpenAPI spec includes this endpoint
 */
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/api/mutator';

export interface TemplateSet {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface TemplateSpecialist {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface TemplateSetDetail extends TemplateSet {
  templates: Record<string, string>;
  skills: string[];
  available_specialists: TemplateSpecialist[];
}

export interface TemplateSetsResponse {
  data: TemplateSet[];
  status: number;
}

export interface TemplateDetailResponse {
  data: TemplateSetDetail;
  status: number;
}

export const listTemplateSetsApiV1BoardsTemplatesGet = async (): Promise<TemplateSetsResponse> => {
  return customFetch<TemplateSetsResponse>('/api/v1/boards/templates', {
    method: 'GET',
  });
};

export const getTemplateSetApiV1BoardsTemplatesTemplateIdGet = async (
  templateId: string
): Promise<TemplateDetailResponse> => {
  return customFetch<TemplateDetailResponse>(`/api/v1/boards/templates/${templateId}`, {
    method: 'GET',
  });
};

export const getListTemplateSetsApiV1BoardsTemplatesGetQueryKey = () => {
  return ['/api/v1/boards/templates'] as const;
};

export const getGetTemplateSetApiV1BoardsTemplatesTemplateIdGetQueryKey = (templateId: string) => {
  return ['/api/v1/boards/templates', templateId] as const;
};

// Simple hook - explicitly typed so callers can access .data.status and .data.data
export const useListTemplateSetsApiV1BoardsTemplatesGet = (options?: {
  query?: Omit<Parameters<typeof useQuery<TemplateSetsResponse>>[0], 'queryKey' | 'queryFn'>;
}) => {
  return useQuery<TemplateSetsResponse>({
    queryKey: getListTemplateSetsApiV1BoardsTemplatesGetQueryKey(),
    queryFn: listTemplateSetsApiV1BoardsTemplatesGet,
    ...options?.query,
  });
};

export const useGetTemplateSetApiV1BoardsTemplatesTemplateIdGet = (
  templateId: string,
  options?: {
    query?: Omit<Parameters<typeof useQuery<TemplateDetailResponse>>[0], 'queryKey' | 'queryFn'>;
  }
) => {
  return useQuery<TemplateDetailResponse>({
    queryKey: getGetTemplateSetApiV1BoardsTemplatesTemplateIdGetQueryKey(templateId),
    queryFn: () => getTemplateSetApiV1BoardsTemplatesTemplateIdGet(templateId),
    ...options?.query,
    enabled: Boolean(templateId),
  });
};
