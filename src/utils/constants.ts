import { Camera } from 'lucide-react';
import { Aperture } from 'lucide-react';
import { GalleryHorizontalEnd } from 'lucide-react';
export interface NavItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
}



export const NavMenuItems: NavItem[] = [
    {
        id: 'New Photoshoot',
        label: 'New Photoshoot',
        icon: Camera,
        href: '/new-photoshoot',
    },
    {
        id: 'My Photoshoots',
        label: 'My Photoshoots',
        icon: Aperture,
        href: '/photoshoots',
    },
    {
        id: 'My Gallery',
        label: 'My Gallery',
        icon: GalleryHorizontalEnd,
        href: '/gallery',
    },

];