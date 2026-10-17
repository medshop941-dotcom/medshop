import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Produit (Bags & Jewelry)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du produit (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameAr',
      title: 'Nom du produit (العربية)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identifiant URL (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix (DH)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Prix barré avant remise (DH)',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie (Français)',
      type: 'string',
      options: {
        list: [
          { title: 'Sacs à Main', value: 'Sacs à Main' },
          { title: 'Sacs de Luxe', value: 'Sacs de Luxe' },
          { title: 'Bijoux & Parures', value: 'Bijoux & Parures' },
          { title: 'Montres & Accessoires', value: 'Montres & Accessoires' },
          { title: 'Pochettes', value: 'Pochettes' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoryAr',
      title: 'Catégorie (العربية)',
      type: 'string',
      options: {
        list: [
          { title: 'حقائب يد', value: 'حقائب يد' },
          { title: 'حقائب فاخرة', value: 'حقائب فاخرة' },
          { title: 'مجوهرات وحلي', value: 'مجوهرات وحلي' },
          { title: 'ساعات وإكسسوارات', value: 'ساعات وإكسسوارات' },
          { title: 'حقائب صغيرة', value: 'حقائب صغيرة' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description détaillée (Français)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Description détaillée (العربية)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'inStock',
      title: 'Quantité en Stock',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Mettre en vedette sur l’accueil',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `${subtitle} DH`,
        media,
      }
    },
  },
})
