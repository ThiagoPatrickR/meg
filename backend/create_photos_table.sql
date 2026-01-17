-- Criação da tabela photos para o álbum de fotos
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image VARCHAR(500) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para ordenação
CREATE INDEX IF NOT EXISTS idx_photos_order ON photos("order");

-- Comentários para documentação
COMMENT ON TABLE photos IS 'Tabela para armazenar fotos do álbum do casamento';
COMMENT ON COLUMN photos.id IS 'ID único da foto';
COMMENT ON COLUMN photos.title IS 'Título ou legenda da foto (opcional)';
COMMENT ON COLUMN photos.image IS 'Nome do arquivo de imagem';
COMMENT ON COLUMN photos."order" IS 'Ordem de exibição da foto';
