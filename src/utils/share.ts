

export interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
}


export const shareFacebook = ({ url }: ShareData) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};


export const shareZalo = ({ url }: ShareData) => {
  const shareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};


export const shareTelegram = ({ url, title }: ShareData) => {
  const text = encodeURIComponent(title);
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};


export const shareTwitter = ({ url, title }: ShareData) => {
  const text = encodeURIComponent(title);
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};


export const copyLink = async (url: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    } else {

      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy link:', err);
    return false;
  }
};


export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.description,
        url: data.url,
      });
      return true;
    } catch {

      return false;
    }
  }
  return false;
};


export const isNativeShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};
