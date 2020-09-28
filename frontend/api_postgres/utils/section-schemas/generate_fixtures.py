from typing import Union
import json
import csv
import jsonschema  # type: ignore
from pathlib import Path

Json = Union[dict, list]


def main() -> None:
    here = Path(__file__).parent.resolve()
    django_root = here.parent.parent.resolve()
    there = (django_root / "fixtures").resolve()

    # Break early if anything has moved unexpectedly:
    assert here.name == "section-schemas"
    assert here == django_root / "utils" / "section-schemas"

    there.mkdir(exist_ok=True)

    def etl(fpath: Path, modelname: str, schema: Json) -> None:
        orig = load_json(fpath)
        jsonschema.validate(schema=schema, instance=orig)
        output = transform(modelname, orig)
        Path(there, f.name).write_text(json.dumps(output))

    schema = load_json(here / "backend-section.schema.json")
    schemafixture = transform("carts_api.sectionschema", schema)
    schemapath = there / "backend-section.schema.json"
    write_json(schemapath, schemafixture)

    for f in here.glob("backend-json-section-*.json"):
        etl(f, "carts_api.sectionbase", schema)

    for f in here.glob("2020-*.json"):
        etl(f, "carts_api.section", schema)

    load_states(here, there)
    load_acs_data(here, there)
    load_fmap_data(here, there)


def transform(model, orig):
    models = {
        "carts_api.sectionschema": {
            "model": "carts_api.sectionschema",
            "fields": {"year": 2020},
        },
        "carts_api.sectionbase": {
            "model": "carts_api.sectionbase",
            "fields": {},
        },
        "carts_api.section": {"model": "carts_api.section", "fields": {}},
    }
    entry = models[model]
    entry["fields"]["contents"] = orig
    return [entry]


def load_states(here, there):
    state_to_abbrev = json.loads(
        Path(here, "state_to_abbrev.json").read_text()
    )
    states = []
    for name, abbrev in state_to_abbrev.items():
        obj = {
            "model": "carts_api.State",
            "fields": {"code": abbrev, "name": name},
        }
        states.append(obj)

    output = Path(there, "states.json")
    output.write_text(json.dumps(states))


def load_acs_data(here, there):
    state_to_abbrev = json.loads(
        Path(here, "state_to_abbrev.json").read_text()
    )

    # census is inconsistent with case in state names so make uniform names
    states_upper = {}
    for k, v in state_to_abbrev.items():
        states_upper[k.upper()] = v

    years = ["2015", "2016", "2017", "2018", "2019"]
    acs_data = []
    for y in years:
        csvf = open(Path(here, "hi10-acs-%s.csv" % y), "r")
        reader = csv.reader(csvf, delimiter=",")
        next(reader)  # skip header
        next(reader)  # skip US totals
        # ACS data uses 'Z' to mean 0 or rounds to 0
        for row in reader:
            obj = {
                "model": "carts_api.ACS",
                "fields": {
                    "year": y,
                    "state": states_upper[row[0].upper()],
                    "number_uninsured": 0
                    if row[1].lower() == "z"
                    else int(row[1]) * 1000,  # numbers measured in thousands
                    "number_uninsured_moe": 0
                    if row[2].lower() == "z"
                    else int(row[2]) * 1000,
                    "percent_uninsured": row[3],
                    "percent_uninsured_moe": row[4],
                },
            }
            acs_data.append(obj)
    outputpath = Path(there, "acs.json")
    outputpath.write_text(json.dumps(acs_data))


def load_fmap_data(here, there):
    csvf = open(Path(here, "2020-fmap-data.csv"), "r")
    reader = csv.DictReader(csvf, delimiter=",")
    fmaps = []
    for row in reader:
        obj = {
            "model": "carts_api.FMAP",
            "fields": {
                "fiscal_year": 2020,
                "state": row["State abbreviation"],
                "enhanced_FMAP": row["enhanced FMAP"],
            },
        }
        fmaps.append(obj)
    outputpath = Path(there, "2020-fmap.json")
    outputpath.write_text(json.dumps(fmaps))


def load_json(path: Path) -> Json:
    return json.loads(path.read_text())


def write_json(path: Path, contents: Json) -> None:
    path.write_text(json.dumps(contents))


if __name__ == "__main__":
    main()