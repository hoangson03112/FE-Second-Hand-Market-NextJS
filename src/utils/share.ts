/**
 * Generate share URLs for different social platforms
 */

export interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

/**
 * Share to Facebook
 */
export const shareFacebook = ({ url }: ShareData) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share to Zalo
 */
export const shareZalo = ({ url }: ShareData) => {
  const shareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share to Telegram
 */
export const shareTelegram = ({ url, title }: ShareData) => {
  const text = encodeURIComponent(title);
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share to Twitter/X
 */
export const shareTwitter = ({ url, title }: ShareData) => {
  const text = encodeURIComponent(title);
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Copy link to clipboard
 */
export const copyLink = async (url: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    } else {
      // Fallback for older browsers
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

/**
 * Native share API (mobile)
 */
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
      // User cancelled or error
      return false;
    }
  }
  return false;
};

/**
 * Check if native share is supported
 */
export const isNativeShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};
