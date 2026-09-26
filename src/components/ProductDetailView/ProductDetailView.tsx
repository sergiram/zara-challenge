import { useState } from 'react';
import type { ProductDetail } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { minimumPrice } from '../../utils/minimumPrice';
import { useCart } from '../../context/cart/useCart';
import { useNavigate } from 'react-router-dom';
import { SpecsTable } from '../SpecsTable/SpecsTable';

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
    <article>
      <img src={displayedColor.imageUrl} alt={`${name} ${displayedColor.name}`} />
      <p>{brand}</p>
      <h1>{name}</h1>
      <p>
        {selectedStorage ? formatPrice(selectedStorage.price) : `From ${formatPrice(minPrice)}`}
      </p>
      <fieldset>
        <legend>STORAGE: HOW MUCH SPACE DO YOU NEED?</legend>
        {storageOptions.map((option) => (
          <label key={option.capacity}>
            <input
              type="radio"
              name="storage"
              value={option.capacity}
              checked={option.capacity === selectedCapacity}
              onChange={() => setSelectedCapacity(option.capacity)}
            />
            {option.capacity}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>COLOR. PICK YOUR FAVOURITE.</legend>
        {colorOptions.map((color) => (
          <label key={color.name}>
            <input
              type="radio"
              name="color"
              value={color.name}
              checked={color.name === selectedColorName}
              onChange={() => setSelectedColorName(color.name)}
            />
            <span aria-hidden="true" style={{ backgroundColor: color.hexCode }} />
            <span className="visually-hidden">{color.name}</span>
          </label>
        ))}
      </fieldset>
      {selectedColor && <p>{selectedColor.name}</p>}
      <button type="button" disabled={!canAddToCart} onClick={handleAddToCart}>
        ADD
      </button>
      <SpecsTable product={product} />
    </article>
  );
};
