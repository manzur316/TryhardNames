import React from 'react';
import PassportIdentityScene from './PassportIdentityScene.jsx';

export default function PublicPassportCard({ passport }) {
  return <PassportIdentityScene
    alias={passport.alias}
    avatarUrl={passport.avatarUrl}
    scene={passport.scene}
    slug={passport.slug}
    updatedAt={passport.updatedAt}
  />;
}
