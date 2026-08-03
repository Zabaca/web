-- One row per agreement link: minted by scripts/mint-contract-link.ts, read and
-- countersigned by the /api/contract routes in worker/index.ts.
--
-- token_hash rather than the token itself. A leak of this table must not hand
-- anyone a working signing link, so the Worker hashes the token from the URL and
-- looks up by the hash. Nothing here can reconstruct a link.
--
-- agreement_sha256 is captured at SIGNING, not at minting, because it has to
-- record what the signer actually saw rather than what we meant to show them.
CREATE TABLE IF NOT EXISTS contract_links (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash        TEXT NOT NULL UNIQUE,
  client_name       TEXT NOT NULL,
  client_entity     TEXT,
  contract_slug     TEXT NOT NULL,
  created_at        TEXT NOT NULL,
  -- Countersignature. All NULL until accepted; signed_at is the "is signed" test.
  signed_at         TEXT,
  signed_name       TEXT,
  signed_title      TEXT,
  agreement_sha256  TEXT,
  signer_ip         TEXT,
  signer_user_agent TEXT
);

CREATE INDEX IF NOT EXISTS contract_links_slug ON contract_links (contract_slug);
