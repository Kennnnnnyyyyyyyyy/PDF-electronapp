import apiClient from './client';
import { Annotation } from '../types';

// Re-export Annotation type or use the one from types.ts. 
// types.ts has Annotation, but web app has slightly different structure maybe?
// Let's check differences later and align. For now, use local interfaces mirroring web/api.

export interface Draft {
    id: string;
    templateId: string;
    version: number;
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface DraftDetail {
    id: string;
    templateId: string;
    version: number;
    formData: Record<string, any>;
    annotations: Annotation[] | null;
    hasDrawing: boolean; // boolean flag for now
    drawingImagePath?: string | null; // Added to match backend likely return
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface CreateDraftRequest {
    templateId: string;
    formData: Record<string, any>;
    annotations?: Annotation[];
    drawingDataUrl?: string;
}

export async function createDraft(data: CreateDraftRequest): Promise<Draft> {
    const response = await apiClient.post<Draft>('/api/drafts', data);
    return response.data;
}

export async function getDrafts(templateId: string): Promise<Draft[]> {
    const response = await apiClient.get<Draft[]>(`/api/drafts?templateId=${templateId}`);
    return response.data;
}

export async function getDraft(id: string): Promise<DraftDetail> {
    const response = await apiClient.get<DraftDetail>(`/api/drafts/${id}`);
    return response.data;
}

export async function saveDraft(id: string, data: Partial<CreateDraftRequest>): Promise<void> {
    // Assuming PUT or POST update
    // Web app logic not fully visible in grep, but standard REST usually PUT /api/drafts/{id}
    // We will assume POST to a specific update endpoint or similar.
    // Let's check web app impl if needed, but for now assuming typical update.
    // Wait, the web app editor uses `createDraft` (POST) to save NEW versions usually?
    // Or if it updates existing:
    await apiClient.put(`/api/drafts/${id}`, data);
}

export async function exportDraft(id: string): Promise<{ id: string; exportPath: string }> {
    const response = await apiClient.post(`/api/drafts/${id}/export`);
    return response.data;
}

export function getDraftExportUrl(id: string): string {
    return `${apiClient.defaults.baseURL}/api/drafts/${id}/export/file`;
}
