import ServicesSection from './Services2';

const Services = () => {
  return (
    <main>
      {/* قسم الخدمات الثابتة */}
      <ServicesSection />

      {/* قسم المنتجات القادمة من Supabase */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 text-center">منتجاتنا</h2>
        </div>
      </section>
    </main>
  );
};

export default Services;
