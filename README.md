
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/initial-setup.sql`
3. Set up the necessary tables:
- users
- subscriptions
- webhook_events

## Supabase Edge Functions

The project uses Supabase Edge Functions for serverless functionality:

- `get-plans`: Retrieves subscription plans from Stripe
- `create-checkout`: Creates a Stripe checkout session
- `payments-webhook`: Handles Stripe webhook events

To deploy the edge functions:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Deploy functions: `supabase functions deploy`

## Stripe Setup

1. Create products and price plans in Stripe dashboard
2. Set up webhook endpoint: `https://your-supabase-project.functions.supabase.co/payments-webhook`
3. Add the webhook secret to your environment variables

## Project Structure

- `/src/app`: Next.js App Router pages and layouts
- `/src/components`: React components including UI components
- `/supabase`: Supabase client, server, and edge functions
- `/public`: Static assets

## Deployment

### Frontend (Next.js)

Deploy to Vercel:

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Backend (Supabase)

1. Create production Supabase project
2. Run migrations
3. Deploy edge functions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [shadcn/ui](https://ui.shadcn.com/)