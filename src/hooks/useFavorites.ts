import { useLocalStorage } from '@mantine/hooks';

const FAVORITES_KEY = 'almoedat-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>({
    key: FAVORITES_KEY,
    defaultValue: []
  });

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
    current.includes(id) ?
    current.filter((favId) => favId !== id) :
    [...current, id]
    );
  };

  return { favorites, isFavorite, toggleFavorite };
}
