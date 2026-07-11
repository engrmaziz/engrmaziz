import json
import os

schemas = {}

def base_schema(schema_id, title, desc, props, required):
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": f"https://api.musharraf.tech/schemas/{schema_id}.json",
        "title": title,
        "description": desc,
        "type": "object",
        "properties": props,
        "required": required,
        "additionalProperties": False
    }

schemas["person"] = base_schema("person", "Person", "Schema for a professional identity.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "title": {"type": "string"},
    "email": {"type": "string", "format": "email"},
    "location": {"type": "string"}
}, ["id", "name", "title"])

schemas["project"] = base_schema("project", "Project", "Schema for a portfolio project.", {
    "id": {"type": "string"},
    "title": {"type": "string"},
    "description": {"type": "string"},
    "github_url": {"type": "string", "format": "uri"},
    "deployed_url": {"type": "string", "format": "uri"},
    "is_nda": {"type": "boolean", "default": False},
    "related_skills": {"type": "array", "items": {"type": "string"}},
    "metrics": {"type": "array", "items": {"type": "string"}}
}, ["id", "title", "description"])

schemas["experience"] = base_schema("experience", "Experience", "Schema for job experience.", {
    "id": {"type": "string"},
    "company": {"type": "string"},
    "role": {"type": "string"},
    "start_date": {"type": "string", "format": "date"},
    "end_date": {"type": "string", "format": "date"},
    "is_current": {"type": "boolean"},
    "description": {"type": "string"},
    "achievements": {"type": "array", "items": {"type": "string"}}
}, ["id", "company", "role", "start_date"])

schemas["education"] = base_schema("education", "Education", "Schema for an academic degree.", {
    "id": {"type": "string"},
    "institution": {"type": "string"},
    "degree": {"type": "string"},
    "start_year": {"type": "integer"},
    "end_year": {"type": "integer"}
}, ["id", "institution", "degree"])

schemas["certification"] = base_schema("certification", "Certification", "Schema for professional certifications.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "issuer": {"type": "string"},
    "date_issued": {"type": "string", "format": "date"},
    "credential_url": {"type": "string", "format": "uri"}
}, ["id", "name", "issuer"])

schemas["service"] = base_schema("service", "Service", "Schema for a professional service offering.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "description": {"type": "string"},
    "target_audience": {"type": "array", "items": {"type": "string"}},
    "deliverables": {"type": "array", "items": {"type": "string"}}
}, ["id", "name", "description"])

schemas["skill"] = base_schema("skill", "Skill", "Schema for a technical or soft skill.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "category": {"type": "string", "enum": ["Frontend", "Backend", "AI", "DevOps", "Database", "Operations"]},
    "proficiency": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"]}
}, ["id", "name", "category", "proficiency"])

schemas["technology"] = base_schema("technology", "Technology", "Schema for a specific framework or tool.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "version": {"type": "string"},
    "url": {"type": "string", "format": "uri"}
}, ["id", "name"])

schemas["industry"] = base_schema("industry", "Industry", "Schema for an industry vertical.", {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "compliance_standards": {"type": "array", "items": {"type": "string"}}
}, ["id", "name"])

schemas["publication"] = base_schema("publication", "Publication", "Schema for written articles or papers.", {
    "id": {"type": "string"},
    "title": {"type": "string"},
    "publisher": {"type": "string"},
    "date_published": {"type": "string", "format": "date"},
    "url": {"type": "string", "format": "uri"}
}, ["id", "title", "date_published"])

schemas["achievement"] = base_schema("achievement", "Achievement", "Schema for a specific quantitative win.", {
    "id": {"type": "string"},
    "metric": {"type": "string"},
    "context": {"type": "string"},
    "project_ref": {"type": "string"}
}, ["id", "metric", "context"])

schemas["faq"] = base_schema("faq", "FAQ", "Schema for a frequently asked question.", {
    "id": {"type": "string"},
    "question": {"type": "string"},
    "answer": {"type": "string"},
    "intent_category": {"type": "string"}
}, ["id", "question", "answer"])

schemas["timeline"] = base_schema("timeline", "Timeline", "Schema for an event timeline.", {
    "id": {"type": "string"},
    "event_name": {"type": "string"},
    "date": {"type": "string", "format": "date"},
    "description": {"type": "string"}
}, ["id", "event_name", "date"])

schemas["relationship"] = base_schema("relationship", "Relationship", "Schema for entity relationships.", {
    "source_id": {"type": "string"},
    "target_id": {"type": "string"},
    "edge_type": {"type": "string", "enum": ["USES", "CREATED", "WORKED_AT", "HAS_SKILL", "REQUIRES", "OPERATES_IN"]}
}, ["source_id", "target_id", "edge_type"])

schemas["kg_node"] = base_schema("kg_node", "Knowledge Graph Node", "Schema for a graph node.", {
    "id": {"type": "string"},
    "label": {"type": "string"},
    "properties": {"type": "object"}
}, ["id", "label"])

schemas["kg_edge"] = base_schema("kg_edge", "Knowledge Graph Edge", "Schema for a graph edge.", {
    "source": {"type": "string"},
    "target": {"type": "string"},
    "relation": {"type": "string"}
}, ["source", "target", "relation"])

schemas["metadata"] = base_schema("metadata", "Metadata", "Schema for system metadata.", {
    "version": {"type": "string"},
    "last_updated": {"type": "string", "format": "date-time"},
    "confidence_score": {"type": "number", "minimum": 0, "maximum": 1}
}, ["version", "last_updated"])

schemas["yaml_front_matter"] = base_schema("yaml_front_matter", "YAML Mapping", "Schema for Markdown YAML headers.", {
    "id": {"type": "string"},
    "title": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "aliases": {"type": "array", "items": {"type": "string"}}
}, ["id", "title"])

schemas["search_index"] = base_schema("search_index", "Search Index", "Schema for a vector DB payload.", {
    "id": {"type": "string"},
    "text_chunk": {"type": "string"},
    "embedding": {"type": "array", "items": {"type": "number"}},
    "metadata": {"$ref": "metadata.json"}
}, ["id", "text_chunk"])

schemas["seo_metadata"] = base_schema("seo_metadata", "SEO Metadata", "Schema for HTML meta tags.", {
    "title": {"type": "string", "maxLength": 60},
    "description": {"type": "string", "maxLength": 160},
    "canonical_url": {"type": "string", "format": "uri"},
    "og_image": {"type": "string", "format": "uri"}
}, ["title", "description"])

schemas["ai_response_template"] = base_schema("ai_response_template", "AI Response Template", "Schema for agent responses.", {
    "id": {"type": "string"},
    "intent": {"type": "string"},
    "template_string": {"type": "string"},
    "variables": {"type": "array", "items": {"type": "string"}}
}, ["id", "intent", "template_string"])

schemas["meeting_qualification"] = base_schema("meeting_qualification", "Meeting Qualification", "Schema for a lead.", {
    "company_name": {"type": "string"},
    "industry": {"type": "string"},
    "tech_stack": {"type": "array", "items": {"type": "string"}},
    "budget_range": {"type": "string"},
    "pain_point": {"type": "string"}
}, ["company_name", "pain_point"])

schemas["recruiter_summary"] = base_schema("recruiter_summary", "Recruiter Summary", "Schema for ATS data.", {
    "candidate_id": {"type": "string"},
    "target_roles": {"type": "array", "items": {"type": "string"}},
    "years_experience": {"type": "integer"},
    "highlight_metrics": {"type": "array", "items": {"type": "string"}}
}, ["candidate_id", "target_roles"])


os.makedirs(r"C:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\platform\schemas", exist_ok=True)
for name, schema in schemas.items():
    with open(f"C:\\Users\\NovaSole Pakistan\\Desktop\\Antigravity\\mak\\platform\\schemas\\{name}.json", "w") as f:
        json.dump(schema, f, indent=2)

print("Schemas generated successfully.")
