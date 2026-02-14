#!/usr/bin/env python3
"""
Test script to verify policy upload and RAG pipeline functionality.
"""
import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"✓ Health check: {response.json()}")
    return response.status_code == 200

def test_list_policies():
    """Test listing policies"""
    print("\n🔍 Testing list policies...")
    response = requests.get(f"{BASE_URL}/policies/")
    data = response.json()
    print(f"✓ Found {data['total']} policies")
    return response.status_code == 200

def test_upload_policy():
    """Test policy upload with a sample PDF"""
    print("\n🔍 Testing policy upload...")
    
    # Create a simple test PDF using reportlab if available, otherwise skip
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        import tempfile
        import os
        
        # Create a temporary PDF
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.pdf', delete=False) as tmp:
            pdf_path = tmp.name
            c = canvas.Canvas(pdf_path, pagesize=letter)
            c.setFont("Helvetica", 12)
            c.drawString(100, 750, "# Medicare Coverage Policy")
            c.drawString(100, 730, "## Section 1: Covered Services")
            c.drawString(100, 710, "Outpatient procedures coded under CPT 99213-99215 are covered")
            c.drawString(100, 690, "when medically necessary and documented with appropriate ICD-10")
            c.drawString(100, 670, "diagnosis codes indicating a qualifying condition.")
            c.drawString(100, 640, "## Section 2: Billing Requirements")
            c.drawString(100, 620, "Claims must include the provider NPI, accurate service dates,")
            c.drawString(100, 600, "and billed amounts consistent with the fee schedule.")
            c.save()
        
        # Upload the PDF
        with open(pdf_path, 'rb') as f:
            files = {'file': ('test_policy.pdf', f, 'application/pdf')}
            data = {
                'name': 'Test Medicare Policy',
                'payer': 'Medicare',
                'effective_date': str(date.today())
            }
            response = requests.post(f"{BASE_URL}/policies/upload", files=files, data=data)
        
        os.unlink(pdf_path)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Policy uploaded successfully!")
            print(f"  - Policy ID: {result['policy']['policy_id']}")
            print(f"  - Chunks created: {result['chunks_created']}")
            return True
        else:
            print(f"✗ Upload failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except ImportError:
        print("⚠ reportlab not installed, skipping PDF upload test")
        print("  Install with: pip install reportlab")
        return None

def test_audit():
    """Test audit endpoint"""
    print("\n🔍 Testing audit endpoint...")
    
    claim_data = {
        "claim_id": "CLM-TEST-001",
        "patient_id": "PAT-12345",
        "payer": "Medicare",
        "service_date": str(date.today()),
        "icd_codes": ["Z00.00"],
        "cpt_codes": ["99213"],
        "billed_amount": 150.00,
        "provider_npi": "1234567890"
    }
    
    response = requests.post(f"{BASE_URL}/audit/", json=claim_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Audit completed successfully!")
        print(f"  - Decision: {result['decision']}")
        print(f"  - Confidence: {result['confidence']}")
        print(f"  - Rules applied: {len(result['rules_applied'])}")
        return True
    else:
        print(f"✗ Audit failed: {response.status_code}")
        print(f"  Error: {response.text}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("APCA ClaimAudit - Backend Test Suite")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "List Policies": test_list_policies(),
        "Upload Policy": test_upload_policy(),
        "Run Audit": test_audit()
    }
    
    print("\n" + "=" * 60)
    print("Test Results Summary:")
    print("=" * 60)
    for test_name, result in results.items():
        if result is True:
            print(f"✓ {test_name}: PASSED")
        elif result is False:
            print(f"✗ {test_name}: FAILED")
        else:
            print(f"⚠ {test_name}: SKIPPED")
    
    all_passed = all(r in [True, None] for r in results.values())
    print("\n" + ("🎉 All tests passed!" if all_passed else "⚠ Some tests failed"))
