CREATE TABLE IF NOT EXISTS categories (
    id UUID UNIQUE ,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    "createdDate" TIMESTAMPTZ NOT NULL,
    active BOOLEAN DEFAULT true, 
    PRIMARY KEY (id)
  );

INSERT INTO categories(id, slug, name, description, "createdDate") VALUES
 ('1bd25554-5af5-4a77-80f1-2ac64269bf4b', 'Products', 'Продукты', 'Описание продуктов', '2022-12-05 23:30:13+03'),
 ('7e930626-0265-4b58-a16d-708f122981a0', 'Cars', 'Автомобили', 'Категория машин', '2022-12-05 23:35:13+03'),
 ('ecd4a883-acae-40bd-a89a-ba0f7b826d4d', 'Honey', 'Мёд', 'Сладкий, густой, вязкий продукт, вырабатываемый пчёлами и родственными насекомыми', '2022-12-05 23:40:13+03'),
 ('1a549168-dc43-4318-bd31-ae789ddf0cf9', 'Smartphone', 'Смартфоны', 'Мобильный телефон, дополненный функциональностью умного устройства', '2022-12-05 23:45:13+03')