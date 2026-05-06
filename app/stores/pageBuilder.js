import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import ctaIcon from '../../icons/ctablock.png'
import gridBlockIcon from '../../icons/gridblock.png'
import heroBlockIcon from '../../icons/heroblock.png'
import listItemIcon from '../../icons/listblock.png'
import mapBlockIcon from '../../icons/mapblock.png'
import teacherListIcon from '../../icons/persongridblock.png'
import relatedarticles from '../../icons/relatedarticles.png'
import testimonialIcon from '../../icons/testimonialblock.png'

export const usePageBuilderStore = defineStore('pageBuilder', {
  state: () => ({
    currentPage: {
      components: [],
      settings: {
        theme: 'default',
        responsive: true,
        maxWidth: {
          value: 900,
          unit: 'px',
        },
      },
    },
    selectedComponent: null,
    draggedComponent: null,
    draggedComponentFrom: null, // 'sidebar' or 'existing' or null
    isAnyGridDragOver: false,
    activeGridId: null, // Track which specific grid is being dragged over
    isPreview: false,
    componentLibrary: [
      // {
      //   id: 'table',
      //   name: 'Table',
      //   icon: 'Table',
      //   category: 'Data',
      //   defaultProps: {
      //     rows: 3,
      //     columns: 3,
      //     data: [
      //       ['Header 1', 'Header 2', 'Header 3'],
      //       ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      //       ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
      //     ],
      //     styling: {
      //       bordered: true,
      //       striped: false,
      //       headerBg: '#f3f4f6',
      //     },
      //   },
      // },
      // {
      //   id: 'datatable',
      //   name: 'DataTable',
      //   icon: 'FileText',
      //   category: 'Data',
      //   defaultProps: {
      //     data: [
      //       {
      //         code: 'P001',
      //         name: 'Product 1',
      //         category: 'Electronics',
      //         quantity: 10,
      //       },
      //       {
      //         code: 'P002',
      //         name: 'Product 2',
      //         category: 'Clothing',
      //         quantity: 25,
      //       },
      //       { code: 'P003', name: 'Product 3', category: 'Books', quantity: 5 },
      //     ],
      //     columns: [
      //       {
      //         field: 'code',
      //         header: 'Code',
      //         sortable: true,
      //         style: 'width: 25%',
      //       },
      //       {
      //         field: 'name',
      //         header: 'Name',
      //         sortable: true,
      //         style: 'width: 25%',
      //       },
      //       {
      //         field: 'category',
      //         header: 'Category',
      //         sortable: true,
      //         style: 'width: 25%',
      //       },
      //       {
      //         field: 'quantity',
      //         header: 'Quantity',
      //         sortable: true,
      //         style: 'width: 25%',
      //       },
      //     ],
      //     size: '',
      //     showGridlines: false,
      //     stripedRows: false,
      //     sortable: true,
      //   },
      // },
      // {
      //   id: 'card',
      //   name: 'Card',
      //   icon: 'Square',
      //   category: 'Layout',
      //   defaultProps: {
      //     title: 'Card Title',
      //     content: 'This is the card content. You can edit this text.',
      //     image: '',
      //     imagePosition: 'top',
      //     styling: {
      //       shadow: true,
      //       rounded: true,
      //       padding: 'medium',
      //       alignment: 'center',
      //     },
      //   },
      // },
      // {
      //   id: 'grid',
      //   name: 'Grid',
      //   icon: 'LayoutGrid',
      //   category: 'Layout',
      //   defaultProps: {
      //     columns: 2,
      //     children: [],
      //   },
      // },
      // {
      //   id: 'text',
      //   name: 'Text',
      //   icon: 'Type',
      //   category: 'Content',
      //   defaultProps: {
      //     content: 'Sample Text',
      //     elementType: 'p',
      //     fontSize: '16px',
      //     fontWeight: 'normal',
      //     isItalic: false,
      //     isUnderline: false,
      //     textAlign: 'left',
      //     lineHeight: '1.5',
      //     letterSpacing: '0px',
      //     textColor: '#000000',
      //     backgroundColor: 'transparent',
      //     paddingHorizontal: '0px',
      //     paddingVertical: '0px',
      //     marginHorizontal: '0px',
      //     marginVertical: '0px',
      //   },
      // },
      // {
      //   id: 'image',
      //   name: 'Image',
      //   icon: 'ImageIcon',
      //   category: 'Content',
      //   defaultProps: {
      //     src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMiIgcng9IjQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgUGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPgo=',
      //     alt: 'Image',
      //     width: '300px',
      //     height: '200px',
      //     objectFit: 'cover',
      //     borderRadius: '0px',
      //     borderWidth: '0px',
      //     borderStyle: 'solid',
      //     borderColor: '#e5e7eb',
      //     shadow: 'none',
      //     opacity: 1,
      //     marginHorizontal: '0px',
      //     marginVertical: '0px',
      //     paddingHorizontal: '0px',
      //     paddingVertical: '0px',
      //     alignment: 'left',
      //     caption: '',
      //     showCaption: false,

      //     captionFontSize: '14px',
      //     captionColor: '#ffffff',
      //     captionStyle: 'normal',
      //     captionOverlay: true,
      //     captionTextAlign: 'left',
      //     captionBackgroundColor: 'rgba(0, 0, 0, 0.7)',
      //     captionPadding: '16px',
      //     preview: false,
      //   },
      // },
      // {
      //   id: 'button',
      //   name: 'Button',
      //   icon: 'MousePointer',
      //   category: 'Interactive',
      //   defaultProps: {
      //     label: 'Button',
      //     severity: 'primary',
      //     variant: 'filled',
      //     size: 'normal',
      //     raised: false,
      //     rounded: false,
      //     disabled: false,
      //     link: '',
      //     target: '_self',
      //     fullWidth: false,
      //     alignment: 'left',
      //     marginHorizontal: '0px',
      //     marginVertical: '0px',
      //     paddingHorizontal: '0px',
      //     paddingVertical: '0px',
      //   },
      // },

      {
        id: 'textimage',
        name: 'Hero Block',
        icon: heroBlockIcon,
        category: 'Content',
        defaultProps: {
          // Title properties
          title: 'Your Title Here',
          titleTag: 'h2',
          titleFontSize: '32px',
          titleFontWeight: 'bold',
          titleColor: '#000000',
          titleAlign: 'left',
          titleMarginBottom: '16px',

          // Paragraph properties
          paragraph:
            'This is your paragraph text. You can customize the styling and content through the properties panel.',
          paragraphFontSize: '16px',
          paragraphColor: '#666666',
          paragraphAlign: 'left',
          paragraphLineHeight: '1.6',
          paragraphMarginBottom: '24px',

          // Media properties
          mediaType: 'image', // 'image' or 'video'
          imageSrc: 'https://placehold.co/600x400',
          imageAlt: 'Sample Image',
          videoSrc: 'https://www.youtube.com/watch?v=MLpWrANjFbI',
          videoAlt: 'Sample Video',

          // Button properties
          buttons: [
            {
              label: 'Primary Button',
              severity: 'primary',
              variant: 'filled',
              link: '',
              target: '_self',
            },
            {
              label: 'Secondary Button',
              severity: 'secondary',
              variant: 'outlined',
              link: '',
              target: '_self',
            },
            {
              label: 'Tertiary Button',
              severity: 'secondary',
              variant: 'text',
              link: '',
              target: '_self',
            },
          ],
          buttonAlignment: 'left',
          buttonSpacing: '12px',

          // Layout properties
          containerPadding: '24px',
          containerMargin: '0px',
          backgroundColor: 'transparent',
          maxWidth: '100%',
          mobileBreakpoint: '768px',
        },
      },

      {
        id: 'teacherlist',
        name: 'Teacher List',
        icon: teacherListIcon,
        category: 'Content',
        defaultProps: {
          title: 'Review our seasoned Piano Instructors in Los Angeles.',
          titleTag: 'h2',
          paragraph:
            'Whether you are looking for jazz, classical, or pop-rock songwriters, our instructors teach children, young adults, and adults.',
          viewMode: 'grid',
          itemsPerPage: 8,

          teachers: [
            {
              id: 1,
              image: 'https://placehold.co/400x400',
              name: 'Jonah Hill',
              discipline: 'Guitar, Voice, Songwriting',
              rating: '4.9',
              ratingCount: '7',
              students: '230',
              price: '20',
              profileSummary:
                'Experienced music instructor with over 10 years of teaching experience.',
              language: 'English, Spanish',
              imageText: 'J',
            },
            {
              id: 2,
              image: 'https://placehold.co/400x400',
              name: 'Ava Green',
              discipline: 'Voice, Piano, Songwriting',
              rating: '4.9',
              ratingCount: '5',
              students: '210',
              price: '25',
              profileSummary:
                'Classical pianist and vocal coach specializing in music theory.',
              language: 'English, French',
              imageText: 'A',
            },
            {
              id: 3,
              image: 'https://placehold.co/400x400',
              name: 'Liam Carter',
              discipline: 'Guitar, Bass Guitar',
              rating: '4.8',
              ratingCount: '12',
              students: '190',
              price: '22',
              profileSummary:
                'Professional guitarist and songwriter with studio experience.',
              language: 'English, Spanish',
              imageText: 'L',
            },
            {
              id: 4,
              image: 'https://placehold.co/400x400',
              name: 'Liam Carter',
              discipline: 'Guitar, Bass Guitar',
              rating: '4.8',
              ratingCount: '12',
              students: '190',
              price: '22',
              profileSummary:
                'Professional guitarist and songwriter with studio experience.',
              language: 'English, Spanish',
              imageText: 'L',
            },
          ],
          buttons: [
            {
              label: 'View More Piano Instructors',
              link: '',
              severity: 'primary',
              variant: 'filled',
            },
            {
              label: 'View All Instructors',
              link: '',
              severity: 'secondary',
              variant: 'outlined',
              target: '_self',
            },
          ],
        },
      },
      {
        id: 'offlineteacherlist',
        name: 'Offline Teacher List',
        icon: teacherListIcon,
        category: 'Content',
        defaultProps: {
          title:
            'Review our seasoned Piano Instructors in Los Angeles (Offline).',
          titleTag: 'h2',
          paragraph:
            'Whether you are looking for jazz, classical, or pop-rock songwriters, our instructors teach children, young adults, and adults.',
          viewMode: 'grid',
          itemsPerPage: 8,

          teachers: [
            {
              id: 1,
              image: 'https://placehold.co/400x400',
              name: 'Jonah Hill',
              discipline: 'Guitar, Voice, Songwriting',
              rating: '4.9',
              ratingCount: '7',
              students: '230',
              price: '20',
              profileSummary:
                'Experienced music instructor with over 10 years of teaching experience.',
              language: 'English, Spanish',
              imageText: 'J',
            },
            {
              id: 2,
              image: 'https://placehold.co/400x400',
              name: 'Ava Green',
              discipline: 'Voice, Piano, Songwriting',
              rating: '4.9',
              ratingCount: '5',
              students: '210',
              price: '25',
              profileSummary:
                'Classical pianist and vocal coach specializing in music theory.',
              language: 'English, French',
              imageText: 'A',
            },
            {
              id: 3,
              image: 'https://placehold.co/400x400',
              name: 'Liam Carter',
              discipline: 'Guitar, Bass Guitar',
              rating: '4.8',
              ratingCount: '12',
              students: '190',
              price: '22',
              profileSummary:
                'Professional guitarist and songwriter with studio experience.',
              language: 'English, Spanish',
              imageText: 'L',
            },
            {
              id: 4,
              image: 'https://placehold.co/400x400',
              name: 'Liam Carter',
              discipline: 'Guitar, Bass Guitar',
              rating: '4.8',
              ratingCount: '12',
              students: '190',
              price: '22',
              profileSummary:
                'Professional guitarist and songwriter with studio experience.',
              language: 'English, Spanish',
              imageText: 'L',
            },
          ],
          buttons: [
            {
              label: 'View More Offline Piano Instructors',
              link: '',
              severity: 'primary',
              variant: 'filled',
            },
            {
              label: 'View All Instructors',
              link: '',
              severity: 'secondary',
              variant: 'outlined',
              target: '_self',
            },
          ],
        },
      },
      {
        id: 'teacherfinderblock',
        name: 'Teacher Finder Block',
        icon: heroBlockIcon,
        category: 'Content',
        defaultProps: {
          title: 'Find Your Perfect Music Teacher',
          titleTag: 'h2',
          paragraph:
            'Search through our curated list of expert music instructors and find the one that best fits your needs.',
          titleFontSize: '32px',
          titleFontWeight: 'bold',
          titleColor: '#000000',
          titleAlign: 'left',
          titleMarginBottom: '16px',
          initialArea: 'California',
          itemsPerPage: 5,
        },
      },
      {
        id: 'searchofflineteacher',
        name: 'Search Offline Teacher',
        icon: heroBlockIcon, // Reusing heroBlockIcon as it's similar (text only)
        category: 'Content',
        defaultProps: {
          title: 'Your Title Here',
          titleTag: 'h2',
          paragraph:
            'This is your paragraph text. You can customize the content through the properties panel.',
          titleFontSize: '32px',
          titleFontWeight: 'bold',
          titleColor: '#000000',
          titleAlign: 'left',
          titleMarginBottom: '16px',
          initialArea: 'California',
        },
      },
      {
        id: 'gridblock',
        name: 'Grid Block',
        icon: gridBlockIcon,
        category: 'Content',
        defaultProps: {
          sectionTitle: 'Your Section Title Here',
          sectionTitleTag: 'h2',
          sectionDescription:
            'This is your paragraph text. You can customize the content through the properties panel.',
          items: [
            {
              title: 'Your Title Here 1',
              paragraph:
                'This is your paragraph text. You can customize the content through the properties panel.',
              imageSrc: 'https://placehold.co/600x400',
              imageAlt: 'Grid item 1',
              link: '',
              linkText: 'Read more',
              linkTarget: '_self',
            },
            {
              title: 'Your Title Here 2',
              paragraph:
                'This is your paragraph text. You can customize the content through the properties panel.',
              imageSrc: 'https://placehold.co/600x400',
              imageAlt: 'Grid item 2',
              link: '',
              linkText: 'Read more',
              linkTarget: '_self',
            },
            {
              title: 'Your Title Here 3',
              paragraph:
                'This is your paragraph text. You can customize the content through the properties panel.',
              imageSrc: 'https://placehold.co/600x400',
              imageAlt: 'Grid item 3',
              link: '',
              linkText: 'Read more',
              linkTarget: '_self',
            },
          ],
          // Button properties
          buttons: [
            {
              label: 'View All Items',
              severity: 'primary',
              variant: 'filled',
              link: '',
              target: '_self',
            },
            {
              label: 'Learn More',
              severity: 'secondary',
              variant: 'outlined',
              link: '',
              target: '_self',
            },
          ],
          buttonAlignment: 'left',
          buttonSpacing: '12px',
          containerPadding: '24px',
          containerMargin: '0px',
          backgroundColor: 'transparent',
          maxWidth: '100%',
          columns: 3,
          gap: '24px',
        },
      },
      {
        id: 'testimonial',
        name: 'Testimonial',
        icon: testimonialIcon,
        category: 'Content',
        defaultProps: {
          quote:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.",
          authorName: 'Wade Warren',
          authorRole: 'Naperville',
          authorImage: '',
          quoteIconColor: '#D9F99D',
        },
      },

      {
        id: 'accordion',
        name: 'Accordion',
        icon: relatedarticles,
        category: 'Content',
        defaultProps: {
          sectionTitle: 'Accordion Header Title',
          sectionTitleTag: 'h2',
          sectionDescription:
            'This is your paragraph text. You can customize the content through the properties panel.',
          value: '0',
          multiple: false,
          panels: [
            {
              header: 'Accordion Header 1',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
            },
            {
              header: 'Accordion Header 2',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
            },
            {
              header: 'Accordion Header 3',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
            },
          ],
        },
      },

      {
        id: 'listitem',
        name: 'List Item',
        icon: listItemIcon,
        category: 'Content',
        defaultProps: {
          title: 'Beginner Piano Lesson Modules:',
          titleTag: 'h2',
          paragraph:
            'This is your paragraph text. You can customize the content through the properties panel.',
          listStyle: 'disc',
          items: [
            'Proper piano posture and finger placement',
            'An introduction to music theory',
            'Basic notes and rhythm',
            'Ear training',
            'How to play simple melodies',
            'Reading on the staff',
            'Audio Production (optional)',
          ],
        },
      },
      {
        id: 'mapblock',
        name: 'Map Block',
        icon: mapBlockIcon,
        category: 'Content',
        defaultProps: {
          title: 'Visit Us',
          titleTag: 'h2',
          paragraph:
            'Find us at the location below. You can customize this map URL from the properties panel.',
          mapTitle: 'Craft Music Location',
          mapSrc:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.615613854761!2d-118.26045!3d34.1622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c08be7c3f0bd%3A0x4f7c9c5f06b1c0f2!2sCraft%20Music!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
          buttons: [
            {
              label: 'Get Directions',
              link: '',
              severity: 'primary',
              variant: 'filled',
            },
            {
              label: 'Contact Us',
              link: '',
              severity: 'secondary',
              variant: 'outlined',
            },
          ],
        },
      },

      {
        id: 'cta',
        name: 'CTA',
        icon: ctaIcon,
        category: 'Content',
        defaultProps: {
          header: 'Ready to start your musical journey?',
          title:
            'We have expert teachers who teach in all styles of music; experts in Jazz, Classical, Pop, and more.',
          buttons: [
            {
              label: 'Find Your Tutor',
              link: '',
              severity: 'primary',
              variant: 'filled',
              target: '_self',
            },
          ],
        },
      },
      {
        id: 'rte',
        name: 'RTE',
        icon: 'FileText',
        category: 'Content',
        defaultProps: {
          content: '<p>Rich text content goes here...</p>',
          paddingHorizontal: '0px',
          paddingVertical: '24px',
          marginHorizontal: '0px',
          marginVertical: '0px',
          backgroundColor: 'transparent',
        },
      },
    ],
  }),

  actions: {
    // Recursive helper function to find components at any depth
    findComponentById(componentId, components = null) {
      const searchComponents = components || this.currentPage.components

      for (const comp of searchComponents) {
        if (comp.id === componentId) {
          return {
            component: comp,
            parent: null,
            parentArray: searchComponents,
          }
        }

        // Recursively search in grid children
        if (comp.type === 'grid' && comp.props.children) {
          const found = this.findComponentById(componentId, comp.props.children)
          if (found.component) {
            return { ...found, parent: comp }
          }
        }
      }

      return { component: null, parent: null, parentArray: null }
    },

    // Helper to recursively update IDs in nested structures
    generateNewIds(component) {
      const newId = uuidv4()
      component.id = newId

      if (component.type === 'grid' && component.props.children) {
        component.props.children.forEach((child) => {
          this.generateNewIds(child)
        })
      }

      return newId
    },

    addComponent(componentType, position = null, index = null) {
      const componentDef = this.componentLibrary.find(
        (c) => c.id === componentType
      )
      if (!componentDef) return

      const newComponent = {
        id: uuidv4(),
        type: componentType,
        position: position || { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' },
        props: JSON.parse(JSON.stringify(componentDef.defaultProps)),
      }

      if (
        index !== null &&
        index >= 0 &&
        index <= this.currentPage.components.length
      ) {
        this.currentPage.components.splice(index, 0, newComponent)
      } else {
        this.currentPage.components.push(newComponent)
      }

      this.selectedComponent = newComponent.id
      return newComponent
    },

    updateComponent(componentId, updates) {
      const component = this.currentPage.components.find(
        (c) => c.id === componentId
      )
      if (component) {
        Object.assign(component, updates)
      }
    },

    updateComponentProps(componentId, props) {
      const { component } = this.findComponentById(componentId)
      if (component) {
        component.props = { ...component.props, ...props }
      }
    },

    deleteComponent(componentId) {
      const { component, parentArray } = this.findComponentById(componentId)
      if (component && parentArray) {
        const index = parentArray.findIndex((c) => c.id === componentId)
        if (index > -1) {
          parentArray.splice(index, 1)
          if (this.selectedComponent === componentId) {
            this.selectedComponent = null
          }
        }
      }
    },

    selectComponent(componentId) {
      this.selectedComponent = componentId
    },

    duplicateComponent(componentId) {
      const { component, parentArray } = this.findComponentById(componentId)
      if (component && parentArray) {
        const duplicated = JSON.parse(JSON.stringify(component))
        this.generateNewIds(duplicated)

        // Add position offset for main canvas components
        if (duplicated.position) {
          duplicated.position.y += 50
        }

        parentArray.push(duplicated)
        this.selectedComponent = duplicated.id
      }
    },

    moveComponent(componentId, newIndex) {
      const component = this.currentPage.components.find(
        (c) => c.id === componentId
      )
      if (component) {
        const currentIndex = this.currentPage.components.indexOf(component)
        this.currentPage.components.splice(currentIndex, 1)
        this.currentPage.components.splice(newIndex, 0, component)
      }
    },

    savePage() {
      const pageData = {
        pageId: this.currentPage.id,
        components: this.currentPage.components,
        settings: this.currentPage.settings,
        timestamp: new Date().toISOString(),
      }

      // This would normally send to your backend
      console.log('Saving page:', pageData)

      // For demo purposes, save to localStorage
      localStorage.setItem(
        `droptik_page_${this.currentPage.id}`,
        JSON.stringify(pageData)
      )

      return pageData
    },

    loadPage(data, isPreview = true) {
      this.currentPage = data
      this.selectedComponent = null
      this.isPreview = isPreview
    },

    clearPage() {
      this.currentPage.components = []
      this.selectedComponent = null
    },

    updatePageSettings(settings) {
      this.currentPage.settings = { ...this.currentPage.settings, ...settings }
    },

    enableComponentEditing(componentId) {
      const { component } = this.findComponentById(componentId)
      if (component) {
        component.isEditing = true
      }
    },

    disableComponentEditing(componentId) {
      const { component } = this.findComponentById(componentId)
      if (component) {
        component.isEditing = false
      }
    },

    toggleComponentEditing(componentId) {
      const { component } = this.findComponentById(componentId)
      if (component) {
        component.isEditing = !component.isEditing
      }
    },

    // --- GRID SUPPORT START ---
    addGrid(columns = 2) {
      if (columns < 2 || columns > 6) columns = 2
      const newGrid = {
        id: uuidv4(),
        type: 'grid',
        props: {
          columns,
          children: [],
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' },
      }
      this.currentPage.components.push(newGrid)
      this.selectedComponent = newGrid.id
      return newGrid
    },

    addComponentToGrid(gridId, componentType, index = null) {
      // Use recursive finder to locate the grid at any depth
      const { component: grid } = this.findComponentById(gridId)
      const componentDef = this.componentLibrary.find(
        (c) => c.id === componentType
      )

      if (!grid || grid.type !== 'grid' || !componentDef) return

      const newComponent = {
        id: uuidv4(),
        type: componentType,
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' },
        props: JSON.parse(JSON.stringify(componentDef.defaultProps)),
      }

      if (index !== null && index >= 0 && index <= grid.props.children.length) {
        // Insert the whole component at the specified index
        grid.props.children.splice(index, 0, newComponent)
      } else {
        // Append the whole component to the end of children array
        grid.props.children.push(newComponent)
      }
      this.selectedComponent = newComponent.id
      return newComponent
    },

    moveComponentInGrid(gridId, fromIndex, toIndex) {
      const { component: grid } = this.findComponentById(gridId)
      if (!grid || grid.type !== 'grid') return
      const children = grid.props.children
      if (
        fromIndex < 0 ||
        fromIndex >= children.length ||
        toIndex < 0 ||
        toIndex >= children.length ||
        fromIndex === toIndex
      )
        return
      const [moved] = children.splice(fromIndex, 1)
      children.splice(toIndex, 0, moved)
    },

    removeComponentFromGrid(gridId, componentId) {
      const { component: grid } = this.findComponentById(gridId)
      if (!grid || grid.type !== 'grid') return
      const idx = grid.props.children.indexOf(componentId)
      if (idx !== -1) {
        grid.props.children.splice(idx, 1)
      }
    },
    // --- GRID SUPPORT END ---

    // --- PREVIEW MODE SUPPORT ---
    togglePreview() {
      this.isPreview = !this.isPreview
    },

    setPreview(value) {
      this.isPreview = value
    },
    // --- PREVIEW MODE SUPPORT END ---
  },

  getters: {
    getSelectedComponent() {
      const { component } = this.findComponentById(this.selectedComponent)
      return component
    },

    getComponentsByType: (state) => (type) => {
      return state.currentPage.components.filter((c) => c.type === type)
    },

    isComponentEditing: () => (componentId) => {
      // Use the findComponentById action to search recursively
      const store = usePageBuilderStore()
      const { component } = store.findComponentById(componentId)
      return component ? !!component.isEditing : false
    },

    getPageJSON: (state) => {
      return {
        pageId: state.currentPage.id,
        components: state.currentPage.components,
        settings: state.currentPage.settings,
      }
    },
  },
})
