import ServicesSection from "./Services2";
import Products from "../pages/Products"; // ✅ عرض المنتجات اللي بتجيب من all_products

const Services = () => {
  return (
    <main>
      {/* قسم الخدمات الثابتة */}
      <ServicesSection />

      {/* قسم المنتجات القادمة من Supabase */}
      <section>
        <div className="container">
          <h2 className="mb-4 text-center">منتجاتنا</h2>
        </div>

        {/* ✅ هون العرض الحقيقي */}
        <Products mode="home" />
      </section>
    </main>
  );
};

export default Services;
