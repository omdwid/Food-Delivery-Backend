import pkg from 'pg'
const { Pool } = pkg

export const connectToDB = async () => {
  const pool =
    process.env.NODE_ENV === 'development'
      ? new Pool({
          user: `${process.env.DB_USER}`,
          host: `${process.env.DB_HOST}`,
          database: `${process.env.DB_NAME}`,
          password: `${process.env.DB_PASSWORD}`,
          port: process.env.DB_PORT,
        })
      : new Pool({
          connectionString: `${process.env.DATABASE_URL}`,
          ssl: {
            rejectUnauthorized: false,
          },
        })

  if (process.env.NODE_ENV === 'development') {
    return pool
  }

  const client = await pool.connect()
  console.log('Connected to DB')

  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS public.organization
        (
            id SERIAL NOT NULL,
            name character varying COLLATE pg_catalog."default",
            CONSTRAINT organization_pkey PRIMARY KEY (id)
        )
      `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.item
      (
          id SERIAL NOT NULL,
          type character varying COLLATE pg_catalog."default",
          description text COLLATE pg_catalog."default",
          CONSTRAINT item_pkey PRIMARY KEY (id)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.pricing
      (
          organization_id integer NOT NULL,
          item_id integer NOT NULL,
          zone character varying COLLATE pg_catalog."default" NOT NULL,
          base_distance_in_km integer DEFAULT 5,
          km_price numeric DEFAULT 1.5,
          fix_price numeric DEFAULT 10,
          CONSTRAINT pricing_pkey PRIMARY KEY (organization_id, item_id, zone),
          CONSTRAINT pricing_item_id_fkey FOREIGN KEY (item_id)
              REFERENCES public.item (id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE NO ACTION,
          CONSTRAINT pricing_organization_id_fkey FOREIGN KEY (organization_id)
              REFERENCES public.organization (id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE NO ACTION
      )`)

    console.log('Database tables created')

    return client
  } catch (error) {
    console.error('Error creating database tables:', error)
  }
}
