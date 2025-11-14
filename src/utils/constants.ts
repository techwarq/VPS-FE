import { Camera } from 'lucide-react';
import { Aperture } from 'lucide-react';
import { GalleryHorizontalEnd } from 'lucide-react';
export interface NavItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>; 
}



export const NavMenuItems: NavItem[] = [
   {
    id: 'New Photoshoot',
    label: 'New Photoshoot',
    icon: Camera,
   },
   {
    id: 'My Photoshoots',
    label: 'My Photoshoots',
    icon: Aperture,
   },
   {
    id: 'My Gallery',
    label: 'My Gallery',
    icon: GalleryHorizontalEnd,

   },

];