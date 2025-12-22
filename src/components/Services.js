// Services.js

import ServicesSection from './Services2';   // أو './service2'
import Products from './Products';           // عدّل المسار حسب مكان Products.js

const Services = () => {
  return (
    <main>
      {/* قسم الخدمات الثابتة */}
      <ServicesSection />

      {/* قسم المنتجات القادمة من Supabase */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 text-center">منتجاتنا</h2>
          {/* <Products /> */}
        </div>
      </section>
    </main>
  );
};

export default Services;
