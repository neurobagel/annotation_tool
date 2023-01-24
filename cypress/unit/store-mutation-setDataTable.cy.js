import { mutations } from "~/store";

let state = {};

describe('setDataTable', () => {
  beforeEach(() => {
    state = {
      dataTable: []
    };
  });

  it('converts and stores a new dataTable in the state', () => {
    mutations.setDataTable(state, [
      ["col1", "col2"],
      ["val1", "val2"],
      ["val21", "val22"]
    ]);
    expect(state.dataTable).to.deep.equal([
      { "col1": "val1", "col2": "val2" },
      { "col1": "val21", "col2": "val22" }
    ]);
  });

  it('strips away empty lines', () => {
    mutations.setDataTable(state, [
      ["col1", "col2"],
      ["", ""],
      ["val21", "val22"],
      [""]
    ]);
    expect(state.dataTable).to.deep.equal([
      { "col1": "val21", "col2": "val22" }
    ]);
  });

  it("warns and then truncates rows that are longer than the header", () => {
    mutations.setDataTable(state, [
      ["col1", "col2"],
      ["val1", "val2"],
      ["val21", "val22", "I'm too long"]
    ]);
    // TODO: find a way to actually assert the warning
    expect(state.dataTable).to.deep.equal([
      { "col1": "val1", "col2": "val2" },
      { "col1": "val21", "col2": "val22" }
    ]);
  });

  it("warns but parses rows that are shorter than the header", () => {
    mutations.setDataTable(state, [
      ["col1", "col2"],
      ["val1", "val2"],
      ["too short"]
    ]);
    // TODO: find a way to actually assert the warning
    expect(state.dataTable).to.deep.equal([
      { "col1": "val1", "col2": "val2" },
      { "col1": "too short" }
    ]);
  });
});
