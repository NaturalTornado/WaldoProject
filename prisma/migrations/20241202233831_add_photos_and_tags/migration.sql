-- CreateTable
CREATE TABLE "photos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "photo_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "x_percent" DOUBLE PRECISION NOT NULL,
    "y_percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
