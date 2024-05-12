-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "images" JSONB,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "todo" (
    "todo_id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "user_id" INTEGER,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("todo_id")
);

-- CreateTable
CREATE TABLE "blog" (
    "blog_id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "summary" VARCHAR(255),
    "user_id" INTEGER,
    "categories" JSON,
    "created_on" VARCHAR(255),

    CONSTRAINT "blog_pkey" PRIMARY KEY ("blog_id")
);

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
