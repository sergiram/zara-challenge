import type { ProductDetail } from '../../types/product';
import styles from './SpecsTable.module.scss';

interface SpecsTableProps {
  product: ProductDetail;
}

export const SpecsTable = ({ product }: SpecsTableProps) => {
  const { brand, name, description, specs } = product;

  const rows = [
    { label: 'Brand', value: brand },
    { label: 'Name', value: name },
    { label: 'Description', value: description },
    { label: 'Screen', value: specs.screen },
    { label: 'Resolution', value: specs.resolution },
    { label: 'Processor', value: specs.processor },
    { label: 'Main camera', value: specs.mainCamera },
    { label: 'Selfie camera', value: specs.selfieCamera },
    { label: 'Battery', value: specs.battery },
    { label: 'OS', value: specs.os },
    { label: 'Screen refresh rate', value: specs.screenRefreshRate },
  ];

  return (
    <section>
      <h2 className={styles.title}>Specifications</h2>
      <dl className={styles.list}>
        {rows.map(({ label, value }) => (
          <div key={label} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
