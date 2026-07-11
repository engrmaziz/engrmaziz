import { getAllServices } from "./lib/services";

const services = getAllServices();
services.forEach(s => {
  console.log(`Title: ${s.title}`);
  console.log(`Slug: ${s.slug}`);
  console.log(`SlugArray:`, s.slugArray);
  if (s.children) {
    console.log(`Children URLs:`);
    s.children.forEach(c => console.log(`  /services/${c.slug}`));
  }
  console.log('---');
});
