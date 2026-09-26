import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { minimumPrice } from '../../utils/minimumPrice';
import { trimImage } from '../../utils/trimImage';
import { useCart } from '../../context/cart/useCart';
import { useTrimmedImage } from '../../hooks/useTrimmedImage';
import { SpecsTable } from '../SpecsTable/SpecsTable';
import styles from './ProductDetailView.module.scss';

interface ProductDetailViewProps {
  product: ProductDetail;
}

export const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const { id, brand, name, basePrice, colorOptions, storageOptions } = product;
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [selectedColorName, setSelectedColorName] = useState<string | null>(() =>
    colorOptions.length === 1 ? colorOptions[0].name : null,
  );
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(() =>
    storageOptions.length === 1 ? storageOptions[0].capacity : null,
  );

  const selectedColor = colorOptions.find((color) => color.name === selectedColorName);
  const selectedStorage = storageOptions.find((option) => option.capacity === selectedCapacity);
  const displayedColor = selectedColor ?? colorOptions[0];
  const minPrice = minimumPrice(storageOptions, basePrice);
  const trimmedImageUrl = useTrimmedImage(displayedColor.imageUrl);

  // Crops every colour up front so switching colours doesn't wait for the download
  useEffect(() => {
    colorOptions.forEach((color) => trimImage(color.imageUrl));
  }, [colorOptions]);

  const canAddToCart = selectedColor !== undefined && selectedStorage !== undefined;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedStorage) return;

    addItem({
      productId: id,
      brand,
      name,
      imageUrl: selectedColor.imageUrl,
      colorName: selectedColor.name,
      capacity: selectedStorage.capacity,
      price: selectedStorage.price,
    });
    navigate('/cart');
  };

  return (
    <article className={styles.detail}>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          {trimmedImageUrl && (
            <img
              className={styles.image}
              src={trimmedImageUrl}
              alt={`${name} ${displayedColor.name}`}
            />
          )}
        </div>
        <div className={styles.info}>
          <p className={styles.brand}>{brand}</p>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.price}>
            {selectedStorage ? formatPrice(selectedStorage.price) : `From ${formatPrice(minPrice)}`}
          </p>
          <fieldset className={styles.storage}>
            <legend className={styles.legend}>Storage: how much space do you need?</legend>
            <div className={styles.storageOptions}>
              {storageOptions.map((option) => (
                <label key={option.capacity} className={styles.storageOption}>
                  <input
                    type="radio"
                    name="storage"
                    className="visually-hidden"
                    value={option.capacity}
                    checked={option.capacity === selectedCapacity}
                    onChange={() => setSelectedCapacity(option.capacity)}
                  />
                  {option.capacity}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.colors}>
            <legend className={styles.legend}>Color. Pick your favourite.</legend>
            <div className={styles.swatches}>
              {colorOptions.map((color) => (
                <label key={color.name} className={styles.swatch}>
                  <input
                    type="radio"
                    name="color"
                    className="visually-hidden"
                    value={color.name}
                    checked={color.name === selectedColorName}
                    onChange={() => setSelectedColorName(color.name)}
                  />
                  <span
                    className={styles.swatchColor}
                    aria-hidden="true"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <span className="visually-hidden">{color.name}</span>
                </label>
              ))}
            </div>
            {/* Always rendered so the button below doesn't jump when a color is picked */}
            <p className={styles.colorName}>{selectedColor?.name}</p>
          </fieldset>
          <button
            type="button"
            className={styles.addButton}
            disabled={!canAddToCart}
            onClick={handleAddToCart}
          >
            Add
          </button>
        </div>
      </div>
      <SpecsTable product={product} />
    </article>
  );
};
