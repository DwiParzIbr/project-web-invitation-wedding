'use client';

import React from 'react';
import { InteractiveWaxSealEnvelope } from '../components/InteractiveWaxSealEnvelope';
import { FrenchGatefoldRibbonCover } from '../components/FrenchGatefoldRibbonCover';
import {
  MinimalistCover1,
  MinimalistCover2,
  MinimalistCover3,
} from '../components/MinimalistCoverLayouts';
import { StandardCoverCard } from '../components/StandardCoverCard';

// 9 Native Covers
import { NativeStandardCover } from './NativeStandardCover';
import { NativeStorySlidesCover } from './NativeStorySlidesCover';
import { NativeMagazineEditorialCover } from './NativeMagazineEditorialCover';
import { NativeCinematicTrailerCover } from './NativeCinematicTrailerCover';
import { NativeRealisticFlipbookCover } from './NativeRealisticFlipbookCover';
import { NativeHorizontalGalleryCover } from './NativeHorizontalGalleryCover';
import { NativeIsometricMapCover } from './NativeIsometricMapCover';
import { NativeRadialConstellationCover } from './NativeRadialConstellationCover';
import { NativeMetroExpressCover } from './NativeMetroExpressCover';

interface CoverResolverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme: any;
  fonts: any;
  designSchema?: any;
  coverCardBg?: string;
}

export const CoverResolver: React.FC<CoverResolverProps> = (props) => {
  const { designSchema } = props;
  const coverStyle = designSchema?.coverStyle;
  const layoutType = designSchema?.layoutType || 'standard_scroll';

  // 1. Check if user explicitly selected a Custom Cover
  if (coverStyle === 'wax_seal_envelope') {
    return <InteractiveWaxSealEnvelope {...props} />;
  }

  if (coverStyle === 'gatefold_ribbon') {
    return <FrenchGatefoldRibbonCover {...props} />;
  }

  if (coverStyle === 'minimalist_1') {
    return <MinimalistCover1 {...props} />;
  }

  if (coverStyle === 'minimalist_2') {
    return <MinimalistCover2 {...props} />;
  }

  if (coverStyle === 'minimalist_3') {
    return <MinimalistCover3 {...props} />;
  }

  if (coverStyle === 'custom_standard') {
    return <StandardCoverCard {...props} />;
  }

  // 2. Native Covers: Automatically match the interaction paradigm (100% harmonious)
  switch (layoutType) {
    case 'story_slides':
      return <NativeStorySlidesCover {...props} />;

    case 'magazine_editorial':
      return <NativeMagazineEditorialCover {...props} />;

    case 'cinematic_trailer':
      return <NativeCinematicTrailerCover {...props} />;

    case '3d_flipbook':
      return <NativeRealisticFlipbookCover {...props} />;

    case 'horizontal_gallery':
      return <NativeHorizontalGalleryCover {...props} />;

    case 'isometric_map':
      return <NativeIsometricMapCover {...props} />;

    case 'radial_constellation':
      return <NativeRadialConstellationCover {...props} />;

    case 'metro_express':
      return <NativeMetroExpressCover {...props} />;

    case 'standard_scroll':
    default:
      return <NativeStandardCover {...props} />;
  }
};
