
import React, { useState, useMemo } from 'react';
import { productData } from '../../data';
import { Product, ProductType, ProductStyle, CharityIssue } from '../../types';
import { MagnifyingGlassIcon } from '../../components/Icons';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
        <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button className="px-4 py-2 bg-white text-orange-500 font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    加入購物車
                </button>
            </div>
        </div>
        <div className="p-4">
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{product.issue}</span>
            <h3 className="mt-2 text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.organization}</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">${product.price}</p>
        </div>
    </div>
);

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const Checkbox: React.FC<{ id: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
        <span className="text-gray-700">{label}</span>
    </label>
);


const SmartSearchFeature: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        types: [] as ProductType[],
        styles: [] as ProductStyle[],
        issues: [] as CharityIssue[],
    });
    const [sort, setSort] = useState('date_desc');

    const handleFilterChange = <K extends keyof typeof filters,>(category: K, value: typeof filters[K][0]) => {
        setFilters(prev => {
            const newValues = prev[category].includes(value)
                ? prev[category].filter(v => v !== value)
                : [...prev[category], value];
            return { ...prev, [category]: newValues };
        });
    };

    const filteredAndSortedProducts = useMemo(() => {
        let products = productData.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.organization.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filters.types.length > 0) {
            products = products.filter(p => filters.types.includes(p.type));
        }
        if (filters.styles.length > 0) {
            products = products.filter(p => filters.styles.includes(p.style));
        }
        if (filters.issues.length > 0) {
            products = products.filter(p => filters.issues.includes(p.issue));
        }

        switch (sort) {
            case 'sales_desc':
                products.sort((a, b) => b.sales - a.sales);
                break;
            case 'price_asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'date_desc':
            default:
                products.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
                break;
        }

        return products;
    }, [searchQuery, filters, sort]);

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">智慧搜尋與篩選</h2>
                <p className="text-gray-600 mt-2">輕鬆找到最符合您心意的公益商品。</p>
            </div>
            <div className="relative mb-8 max-w-2xl mx-auto">
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="輸入商品、風格或議題…"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">篩選條件</h2>
                        <FilterSection title="產品種類">
                            {Object.values(ProductType).map(type => (
                                <Checkbox key={type} id={type} label={type} checked={filters.types.includes(type)} onChange={() => handleFilterChange('types', type)} />
                            ))}
                        </FilterSection>
                        <FilterSection title="產品風格">
                            {Object.values(ProductStyle).map(style => (
                                <Checkbox key={style} id={style} label={style} checked={filters.styles.includes(style)} onChange={() => handleFilterChange('styles', style)} />
                            ))}
                        </FilterSection>
                        <FilterSection title="公益議題">
                           {Object.values(CharityIssue).map(issue => (
                                <Checkbox key={issue} id={issue} label={issue} checked={filters.issues.includes(issue)} onChange={() => handleFilterChange('issues', issue)} />
                            ))}
                        </FilterSection>
                    </div>
                </aside>
                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <p className="text-gray-600">找到 {filteredAndSortedProducts.length} 件商品</p>
                        <select 
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                            <option value="date_desc">最新上架</option>
                            <option value="sales_desc">熱銷排行</option>
                            <option value="price_asc">價格由低到高</option>
                            <option value="price_desc">價格由高到低</option>
                        </select>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                    {filteredAndSortedProducts.length === 0 && (
                         <div className="text-center text-gray-600 bg-gray-50 p-12 rounded-lg">
                            <p className="text-lg font-semibold">找不到符合條件的商品</p>
                            <p className="mt-2">請試著調整您的搜尋關鍵字或篩選條件。</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SmartSearchFeature;
