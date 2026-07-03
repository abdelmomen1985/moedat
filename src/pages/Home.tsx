import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { SearchSection } from '../components/SearchSection';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { FeaturesSection } from '../components/FeaturesSection';
import { getAllEquipment } from '../data/repository';
import { buildSearchParams, SearchValues } from '../utils/searchParams';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Home() {
  const navigate = useNavigate();
  const featured = getAllEquipment().slice(0, 8);
  useDocumentTitle('الرئيسية');

  const handleSearch = (values: SearchValues) => {
    navigate(`/equipment?${buildSearchParams(values).toString()}`);
  };

  return (
    <>
      <HeroSection />
      <SearchSection onSearch={handleSearch} />
      <EquipmentGrid
        items={featured}
        title="أحدث المعدات المتاحة"
        description="تصفح أحدث إعلانات المعدات الثقيلة المتاحة للإيجار والبيع من أفضل الشركات الموثوقة"
        onLoadMore={() => navigate('/equipment')}
        loadMoreLabel="عرض المزيد"
        hasMore={featured.length < getAllEquipment().length} />

      <FeaturesSection />
    </>);

}
