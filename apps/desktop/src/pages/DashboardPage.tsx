import { useEffect, useState } from 'react';
import { getTemplates, uploadTemplate, deleteTemplate, Template } from '../api/templates';
import { getDrafts, createDraft, Draft } from '../api/drafts';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText, Calendar, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

export default function DashboardPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            loadDrafts(selectedTemplate.id);
        } else {
            setDrafts([]);
        }
    }, [selectedTemplate]);

    const loadTemplates = async () => {
        setIsLoading(true);
        try {
            const list = await getTemplates();
            setTemplates(list);
        } catch (error) {
            console.error('Failed to load templates', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadDrafts = async (templateId: string) => {
        try {
            const list = await getDrafts(templateId);
            setDrafts(list);
        } catch (error) {
            console.error('Failed to load drafts', error);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadTemplate(file, file.name, "My College"); // Default college for now
            await loadTemplates();
        } catch (error) {
            alert('Failed to upload template');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure? This will delete all drafts associated with this template.')) return;

        try {
            await deleteTemplate(id);
            if (selectedTemplate?.id === id) setSelectedTemplate(null);
            await loadTemplates();
        } catch (error) {
            alert('Failed to delete template');
        }
    };

    const handleNewDraft = async () => {
        if (!selectedTemplate) return;
        try {
            const draft = await createDraft({
                templateId: selectedTemplate.id,
                formData: {},
                annotations: []
            });
            navigate(`/editor/${draft.id}`);
        } catch (error) {
            alert('Failed to create new draft');
        }
    };

    const handleOpenDraft = (draftId: string) => {
        navigate(`/editor/${draftId}`);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar - Templates List */}
            <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-100">Projects</h2>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 p-2 rounded text-white transition">
                        <Plus size={20} />
                        <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={isUploading} />
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {isLoading ? (
                        <div className="text-center text-gray-500 mt-4">Loading...</div>
                    ) : templates.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <Upload className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No projects yet.</p>
                            <p className="text-sm">Upload a PDF to start.</p>
                        </div>
                    ) : (
                        templates.map(t => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTemplate(t)}
                                className={clsx(
                                    "p-3 rounded cursor-pointer group flex justify-between items-center transition",
                                    selectedTemplate?.id === t.id ? "bg-blue-900/40 border border-blue-500/50" : "hover:bg-gray-700/50 border border-transparent"
                                )}
                            >
                                <div className="truncate">
                                    <div className="font-medium truncate">{t.title}</div>
                                    <div className="text-xs text-gray-400">{new Date(t.createdAtUtc).toLocaleDateString()}</div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteTemplate(t.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400 truncate max-w-[150px]">{user?.email}</div>
                        <button onClick={logout} className="text-xs text-red-400 hover:underline">Logout</button>
                    </div>
                </div>
            </div>

            {/* Main Content - Drafts List */}
            <div className="flex-1 flex flex-col bg-gray-900 p-8 overflow-y-auto">
                {selectedTemplate ? (
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedTemplate.title}</h1>
                                <p className="text-gray-400 flex items-center gap-2">
                                    <FileText size={16} />
                                    {selectedTemplate.originalFileName}
                                </p>
                            </div>
                            <button
                                onClick={handleNewDraft}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-lg shadow-blue-900/20"
                            >
                                <Plus size={20} />
                                New Draft
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drafts.length === 0 ? (
                                <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-700 rounded-xl">
                                    <p className="text-gray-500 text-lg">No drafts yet</p>
                                    <p className="text-gray-600">Create a new draft to get started</p>
                                </div>
                            ) : (
                                drafts.map(draft => (
                                    <div
                                        key={draft.id}
                                        onClick={() => handleOpenDraft(draft.id)}
                                        className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/30 rounded-xl p-4 cursor-pointer transition group shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded font-mono">
                                                v{draft.version}
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(draft.updatedAtUtc).toLocaleDateString()}</span>
                                        </div>
                                        <div className="h-20 flex items-center justify-center text-gray-600 group-hover:text-blue-400 transition">
                                            <FileText size={40} />
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                Last edited
                                            </span>
                                            <span>{new Date(draft.updatedAtUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="bg-gray-800 p-6 rounded-full mb-4">
                            <FileText size={48} className="opacity-50" />
                        </div>
                        <h2 className="text-xl font-medium text-gray-300">Select a Project</h2>
                        <p className="mt-2 text-gray-500">Choose a project from the sidebar or upload a new PDF</p>
                    </div>
                )}
            </div>
        </div>
    );
}
