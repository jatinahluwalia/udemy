import { ICategory } from '@/lib/models/category.model';
import CategoryItem from './category-item';
interface CategoriesProps {
  items: ICategory[];
}

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={`${item._id}`}
          label={item.name}
          value={`${item._id}`}
        />
      ))}
    </div>
  );
};

export default Categories;
