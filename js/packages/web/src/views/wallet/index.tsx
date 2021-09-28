import { useMeta } from '@oyster/common';
import React from 'react'
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';
import { ArtCard } from '../../components/ArtCard';
import { CardLoader } from '../../components/MyLoader';
import { useUserArts } from '../../hooks';

export const WalletView = () => {
    const ownedMetadata = useUserArts();
    const items = ownedMetadata.map(m => m.metadata);
    const { metadata, isLoading } = useMeta();

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
      };
    let allowMultiple = false;

    const artworkGrid = (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {!isLoading
            ? items.map((m, idx) => {
                const id = m.pubkey;
                return (
                  <Link to={`/art/${id}`} key={idx}>
                    <ArtCard
                      key={id}
                      pubkey={m.pubkey}
                      preview={false}
                      height={250}
                      width={250}
                    />
                  </Link>
                );
              })
            : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        </Masonry>
      );
    return (
        <div>
            {artworkGrid}
        </div>
    )
  };
  