# Technical Assessment

## Objective
The purpose of this assessment is to distinguish candidates with in-depth knowledge of Laravel, Next.js, and Tailwind CSS.

## Instructions
Candidates must answer technical questions related to:
- **Laravel**: Eloquent ORM, MVC Architecture, Services, Middleware, Query Optimization.
- **Next.js**: Server-Side Rendering (SSR), Static Site Generation (SSG), API routes, Error Handling.
- **Performance Optimization**: Caching techniques, code efficiency improvements.
- **Security**: Protection against common vulnerabilities like CSRF, XSS, etc.

## Assessment Criteria
Candidates will be evaluated based on:
- **Accuracy of answers**
- **Understanding of technical concepts**
- **Ability to propose relevant solutions**

---

## Laravel
### How Middleware Works in Laravel
Middleware acts as a filtering mechanism for HTTP requests before they reach the application logic. Middleware can handle tasks such as authentication, logging, or modifying request data.

### Optimizing Eloquent Queries
To improve performance:
1. **Use `select()` to retrieve only needed columns:**
   ```php
   User::select('id', 'name')->get();
   ```
2. **Eager load relationships:**
   ```php
   Post::with('comments')->get();
   ```
3. **Chunk large datasets:**
   ```php
   User::chunk(100, function ($users) {
       foreach ($users as $user) {
           // Process user
       }
   });
   ```

---

## Next.js
### Difference Between SSR and SSG
- **SSR (Server-Side Rendering)**: Pages are rendered on each request.
  - Use case: Dynamic content that changes per request (e.g., personalized dashboards).
- **SSG (Static Site Generation)**: Pages are pre-rendered at build time.
  - Use case: Static content that doesn't change often (e.g., blogs, marketing pages).

#### Example:
- **SSR using `getServerSideProps`**:
  ```js
  export async function getServerSideProps(context) {
    const data = await fetch('https://api.example.com/data');
    return { props: { data } };
  }
  ```
- **SSG using `getStaticProps`**:
  ```js
  export async function getStaticProps() {
    const data = await fetch('https://api.example.com/data');
    return { props: { data } };
  }
  ```

### Handling Errors in Next.js
- **Using `getServerSideProps` for API Errors**:
  ```js
  export async function getServerSideProps() {
    try {
      const res = await fetch('https://api.example.com/data');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return { props: { data } };
    } catch (error) {
      return { props: { error: error.message } };
    }
  }
  ```
- **Using Error Boundaries for Client-Side Errors**:
  ```js
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }
  ```

---

## Tailwind CSS
### Pros and Cons
**Pros:**
- Highly customizable and utility-first.
- Reduces the need for writing custom CSS.
- Faster development workflow.
- Optimized for performance with tree-shaking.

**Cons:**
- Can lead to bloated HTML if not managed properly.
- Learning curve for utility-first methodology.
- Requires configuration for custom designs.

### Customizing Tailwind CSS Default Theme
Customization is done in `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
};
```
After changes, restart the development server:
```sh
npm run dev
```

---


