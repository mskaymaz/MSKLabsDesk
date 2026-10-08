import React, { useState, useEffect } from 'react';
import type { BlogPost, BlogChannel } from '../types';
import { api } from '../services/api';
import { PostFilterBar } from '../components/posts/PostFilterBar';
import { PostList } from '../components/posts/PostList';
import { PostEditorModal, type PostFormData } from '../components/posts/PostEditorModal';

export const PostsView: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [channels, setChannels] = useState<BlogChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiTranslating, setAiTranslating] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState<PostFormData>({
    channel_id: '',
    slug: '',
    title_tr: '',
    title_en: '',
    title_ar: '',
    content_tr: '',
    content_en: '',
    content_ar: '',
    summary_tr: '',
    summary_en: '',
    summary_ar: '',
    cover_image: '',
    meta_keywords: '',
    status: 'draft',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.getPosts(), api.getChannels()]);
      setPosts(pRes.posts || []);
      setChannels(cRes.channels || []);
      if (cRes.channels && cRes.channels.length > 0 && !formData.channel_id) {
        setFormData((prev) => ({ ...prev, channel_id: cRes.channels[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAiTranslate = async () => {
    if (!formData.title_tr || !formData.content_tr) {
      alert('Lütfen önce Türkçe başlık ve içerik alanlarını doldurun!');
      return;
    }

    setAiTranslating(true);
    try {
      const res = await api.translatePostAI({
        title_tr: formData.title_tr,
        content_tr: formData.content_tr,
        summary_tr: formData.summary_tr,
      });

      if (res.success && res.translation) {
        const t = res.translation;
        setFormData((prev) => ({
          ...prev,
          title_en: t.title_en || prev.title_en,
          title_ar: t.title_ar || prev.title_ar,
          summary_tr: t.summary_tr || prev.summary_tr,
          summary_en: t.summary_en || prev.summary_en,
          summary_ar: t.summary_ar || prev.summary_ar,
          content_en: t.content_en || prev.content_en,
          content_ar: t.content_ar || prev.content_ar,
          meta_keywords: t.meta_keywords || prev.meta_keywords,
        }));
        alert('✨ Gemini AI ile İngilizce ve Arapça çevirileri ile SEO özetleri başarıyla üretildi!');
      }
    } catch (err: any) {
      alert(err.message || 'AI Çevirisi başarısız oldu');
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.channel_id || !formData.title_tr || !formData.slug) return;

    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, formData);
      } else {
        await api.createPost(formData);
      }
      setShowEditor(false);
      setEditingPost(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Kaydedilemedi');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      await api.deletePost(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Silinemedi');
    }
  };

  const handleOpenNewEditor = () => {
    setEditingPost(null);
    setFormData({
      channel_id: channels[0]?.id || '',
      slug: '',
      title_tr: '',
      title_en: '',
      title_ar: '',
      content_tr: '',
      content_en: '',
      content_ar: '',
      summary_tr: '',
      summary_en: '',
      summary_ar: '',
      cover_image: '',
      meta_keywords: '',
      status: 'draft',
    });
    setShowEditor(true);
  };

  const handleOpenEditEditor = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      channel_id: post.channel_id,
      slug: post.slug,
      title_tr: post.title_tr,
      title_en: post.title_en || '',
      title_ar: post.title_ar || '',
      content_tr: post.content_tr,
      content_en: post.content_en || '',
      content_ar: post.content_ar || '',
      summary_tr: post.summary_tr || '',
      summary_en: post.summary_en || '',
      summary_ar: post.summary_ar || '',
      cover_image: post.cover_image || '',
      meta_keywords: post.meta_keywords || '',
      status: post.status === 'published' ? 'published' : 'draft',
    });
    setShowEditor(true);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PostFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewPost={handleOpenNewEditor}
      />

      <PostList
        posts={filteredPosts}
        loading={loading}
        onEdit={handleOpenEditEditor}
        onDelete={handleDeletePost}
      />

      <PostEditorModal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        editingPost={editingPost}
        channels={channels}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSavePost}
        onAiTranslate={handleAiTranslate}
        aiTranslating={aiTranslating}
      />
    </div>
  );
};
