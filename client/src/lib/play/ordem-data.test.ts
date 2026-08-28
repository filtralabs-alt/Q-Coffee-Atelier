import { describe, it, expect } from "vitest";
import { ORDEM_METHODS, getOrdemMethod } from "./ordem-data";

describe("ordem-data", () => {
  it("tem o metodo v60 com pelo menos 5 passos", () => {
    const v60 = getOrdemMethod("v60");
    expect(v60).toBeDefined();
    expect(v60!.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("todo passo tem fr e pt nao vazios", () => {
    for (const method of ORDEM_METHODS) {
      for (const step of method.steps) {
        expect(step.fr.trim().length).toBeGreaterThan(0);
        expect(step.pt.trim().length).toBeGreaterThan(0);
      }
    }
  });
  it("getOrdemMethod retorna undefined para chave desconhecida", () => {
    expect(getOrdemMethod("chemex")).toBeUndefined();
  });
});
