export function getAvatarSrc(userId: string, avatarVersion: number = 0) {
    return `/api/avatar/${userId}?v=${avatarVersion}`;
}
