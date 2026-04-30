from __future__ import annotations

import importlib
import os
import sys
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient


TEST_ENV = {
    "BACKEND_STAGE_DELAY_MS": "0",
    "BACKEND_CORS_ORIGINS": "*",
}


@pytest.fixture
def client() -> Iterator[TestClient]:
    original_env = {key: os.environ.get(key) for key in TEST_ENV}
    for key, value in TEST_ENV.items():
        os.environ[key] = value

    for module_name in [
        "backend.app.config",
        "backend.app.main",
        "backend.app.orchestrator",
    ]:
        _ = sys.modules.pop(module_name, None)

    main_module = importlib.import_module("backend.app.main")
    main_module = importlib.reload(main_module)

    try:
        with TestClient(main_module.app) as test_client:
            yield test_client
    finally:
        for key, value in original_env.items():
            if value is None:
                _ = os.environ.pop(key, None)
            else:
                os.environ[key] = value
