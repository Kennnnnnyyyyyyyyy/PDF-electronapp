import apiClient from './client';

export interface Template {
    id: string;
    title: string;
    collegeName: string | null;
    originalFileName: string;
    hasFormFields: boolean;
    createdAtUtc: string;
}

export async function getTemplates(): Promise<Template[]> {
    const response = await apiClient.get<Template[]>('/api/templates');
    return response.data;
}

export async function uploadTemplate(
    file: File,
    title: string,
    collegeName: string
): Promise<Template> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('collegeName', collegeName);

    const response = await apiClient.post<Template>('/api/templates', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export function getTemplateFileUrl(templateId: string): string {
    // Use the base URL from the client configuration if needed, but for now hardcode or relative
    // If useAuth is used, we might need to handle auth token for images/files if they are protected
    // For file download links, we might need a presigned URL or just a direct link if cookies are used (desktop uses header)
    // Since we use Bearer token header, standard <img src> or <a href> won't work for protected resources without a token.
    // We'll need a way to fetch blob and create object URL, or valid public URL.
    // For now, let's assume we use the client to fetch blob.
    return `${apiClient.defaults.baseURL}/api/templates/${templateId}/file`;
}

export async function deleteTemplate(templateId: string): Promise<void> {
    await apiClient.delete(`/api/templates/${templateId}`);
}
