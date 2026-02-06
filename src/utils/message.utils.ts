/**
 * Format timestamp to a human-readable time
 */
export function formatMessageTime(timestamp: number | string): string {
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp) 
    : new Date(timestamp);
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Less than 1 minute
  if (diffMins < 1) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  
  // Less than 24 hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  
  // Less than 7 days
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  // More than 7 days - show date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Format full date and time
 */
export function formatFullDateTime(timestamp: number | string): string {
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp) 
    : new Date(timestamp);
    
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get profile image URL with fallback
 */
export function getProfileImageUrl(
  profileImage: string | null | undefined,
  baseUrl: string = 'http://localhost:5000'
): string | null {
  if (!profileImage) return null;
  
  if (profileImage.startsWith('http')) {
    return profileImage;
  }
  
  return `${baseUrl}${profileImage}`;
}
