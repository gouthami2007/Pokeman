import { useEffect, useState, type ImgHTMLAttributes } from 'react';

interface PokemonSpriteProps extends ImgHTMLAttributes<HTMLImageElement> {
  spriteId: number;
  name: string;
}

const PLACEHOLDER_SRC = '/images/pokemon-placeholder.svg';

export function PokemonSprite({ spriteId, name, ...props }: PokemonSpriteProps) {
  const [imageSrc, setImageSrc] = useState<string>(PLACEHOLDER_SRC);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const candidates = getSpriteCandidates(spriteId);
    
    const loadImage = async () => {
      for (const url of candidates) {
        if (!isMounted) return;
        
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
          });
          
          // If we reach here, the image loaded successfully
          if (isMounted) {
            setImageSrc(url);
            setIsLoading(false);
          }
          return;
        } catch (e) {
          // Continue to next candidate if this one fails
          continue;
        }
      }
      
      // If all candidates fail, fall back to placeholder
      if (isMounted) {
        setImageSrc(PLACEHOLDER_SRC);
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [spriteId]);

  return (
    <img 
      src={imageSrc} 
      alt={name} 
      style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s ease-in-out', ...props.style }}
      {...props} 
    />
  );
}

function getSpriteCandidates(spriteId: number) {
  const paddedId = String(spriteId).padStart(3, '0');
  return [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${spriteId}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteId}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${spriteId}.png`,
    `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`,
  ];
}
