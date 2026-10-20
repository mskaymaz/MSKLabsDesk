import React, { useState, useEffect } from 'react';
import type { BlogPost, BlogChannel, PostFormData } from '../types';
import { api } from '../services/api';
import { PostFilterBar } from '../components/posts/PostFilterBar';
import { PostList } from '../components/posts/PostList';
import { BlogStudioView } from './BlogStudioView';
import { useTranslation } from '../context/I18nContext';

export const PostsView: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [channels, setChannels] = useState<BlogChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiTranslating, setAiTranslating] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

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
    video_url: '',
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
      alert(t('posts.fillTrFirst'));
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
        const trans = res.translation;
        setFormData((prev) => ({
          ...prev,
          title_en: trans.title_en || prev.title_en,
          title_ar: trans.title_ar || prev.title_ar,
          summary_tr: trans.summary_tr || prev.summary_tr,
          summary_en: trans.summary_en || prev.summary_en,
          summary_ar: trans.summary_ar || prev.summary_ar,
          content_en: trans.content_en || prev.content_en,
          content_ar: trans.content_ar || prev.content_ar,
          meta_keywords: trans.meta_keywords || prev.meta_keywords,
        }));
        const msg = trans.quality_notes
          ? `${t('posts.aiSuccess')}\n\n✓ ${trans.quality_notes}`
          : t('posts.aiSuccess');
        alert(msg);
      }
    } catch (err: any) {
      alert(err.message || t('common.error'));
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
      alert(err.message || t('common.error'));
    }
  };

  const handlePublishPost = async (post: BlogPost) => {
    try {
      await api.updatePostStatus(post.id, 'published');
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleUnpublishPost = async (post: BlogPost) => {
    try {
      await api.updatePostStatus(post.id, 'unpublished');
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleMoveToTrash = async (id: string) => {
    if (!confirm('Makale çöp kutusuna taşınacaktır. Onaylıyor musunuz?')) return;
    try {
      await api.deletePost(id, false);
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleRestoreFromTrash = async (id: string) => {
    try {
      await api.updatePostStatus(id, 'unpublished');
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('DİKKAT: Bu makale veritabanından KALICI OLARAK silinecektir. Bu işlem geri alınamaz!\n\nKalıcı olarak silmek istediğinize kesinlikle emin misiniz?')) return;
    try {
      await api.deletePost(id, true);
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
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
      video_url: '',
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
      video_url: post.video_url || '',
      meta_keywords: post.meta_keywords || '',
      status: (post.status === 'published' || post.status === 'unpublished' || post.status === 'trash') ? post.status : 'draft',
    });
    setShowEditor(true);
  };

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title_tr.toLowerCase().includes(q) ||
      (post.title_en && post.title_en.toLowerCase().includes(q)) ||
      (post.title_ar && post.title_ar.toLowerCase().includes(q)) ||
      post.slug.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all'
        ? post.status !== 'trash'
        : statusFilter === 'unpublished'
        ? post.status === 'unpublished' || post.status === 'archived'
        : post.status === statusFilter;

    const matchesChannel =
      channelFilter === 'all' ||
      post.channel_id === channelFilter ||
      (post.channel_slug && post.channel_slug === channelFilter);

    return matchesSearch && matchesStatus && matchesChannel;
  });

  if (showEditor) {
    return (
      <BlogStudioView
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
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <PostFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        channelFilter={channelFilter}
        onChannelFilterChange={setChannelFilter}
        channels={channels}
        totalCount={posts.length}
        filteredCount={filteredPosts.length}
        onNewPost={handleOpenNewEditor}
      />

      <PostList
        posts={filteredPosts}
        channels={channels}
        loading={loading}
        onEdit={handleOpenEditEditor}
        onPublish={handlePublishPost}
        onUnpublish={handleUnpublishPost}
        onMoveToTrash={handleMoveToTrash}
        onRestore={handleRestoreFromTrash}
        onPermanentDelete={handlePermanentDelete}
      />
    </div>
  );
};
