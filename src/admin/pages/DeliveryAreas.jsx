import { useEffect, useState } from "react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { HTTP } from "../../utils";
import "../../assets/css/admin-delivery-areas.css";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function DeliveryAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState({ name: "", fee: "", is_active: true });

  const loadAreas = () => {
    setLoading(true);
    HTTP.get("/admin/delivery-areas", auth())
      .then(({ data }) => setAreas(data?.delivery_areas || []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load delivery areas."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAreas(); }, []);

  const updateDraft = (id, field, value) => {
    setAreas((current) => current.map((area) => area.id === id ? { ...area, [field]: value } : area));
  };

  const saveArea = async (area) => {
    setSaving(true);
    try {
      const { data } = await HTTP.put(`/admin/delivery-areas/${area.id}`, {
        name: area.name.trim(),
        fee: Number(area.fee),
        is_active: Boolean(area.is_active),
      }, auth());
      setAreas((current) => current.map((item) => item.id === area.id ? data.delivery_area : item));
      toast.success("Delivery area saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this delivery area.");
    } finally {
      setSaving(false);
    }
  };

  const addArea = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await HTTP.post("/admin/delivery-areas", {
        ...newArea,
        name: newArea.name.trim(),
        fee: Number(newArea.fee),
      }, auth());
      setAreas((current) => [...current, data.delivery_area].sort((a, b) => a.name.localeCompare(b.name)));
      setNewArea({ name: "", fee: "", is_active: true });
      toast.success("Delivery area added.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add this delivery area.");
    } finally {
      setSaving(false);
    }
  };

  const removeArea = async (area) => {
    try {
      await HTTP.delete(`/admin/delivery-areas/${area.id}`, auth());
      setAreas((current) => current.filter((item) => item.id !== area.id));
      toast.success("Delivery area removed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove this delivery area.");
    }
  };

  return (
    <div className="admin-delivery-page">
      <div className="admin-page-heading">
        <div><h2>Delivery areas</h2><p>Set the areas and prices customers can choose at checkout.</p></div>
        <span className="admin-order-total">{areas.length} areas</span>
      </div>

      <form className="admin-delivery-add" onSubmit={addArea}>
        <label>Area name<input value={newArea.name} onChange={(event) => setNewArea({ ...newArea, name: event.target.value })} maxLength={80} required placeholder="e.g. Victoria Island" /></label>
        <label>Delivery fee (NGN)<input type="number" min="0" step="1" value={newArea.fee} onChange={(event) => setNewArea({ ...newArea, fee: event.target.value })} required placeholder="5000" /></label>
        <button className="btn btn-primary" type="submit" disabled={saving}><FaPlus /> Add area</button>
      </form>

      <div className="admin-delivery-list">
        {loading ? <div className="admin-loading">Loading delivery areas…</div> : areas.map((area) => (
          <article className="admin-delivery-row" key={area.id}>
            <label>Area name<input value={area.name} onChange={(event) => updateDraft(area.id, "name", event.target.value)} maxLength={80} /></label>
            <label>Delivery fee (NGN)<input type="number" min="0" step="1" value={area.fee} onChange={(event) => updateDraft(area.id, "fee", event.target.value)} /></label>
            <label className="admin-delivery-active"><input type="checkbox" checked={Boolean(area.is_active)} onChange={(event) => updateDraft(area.id, "is_active", event.target.checked)} /> Available at checkout</label>
            <div className="admin-delivery-actions">
              <button type="button" className="btn btn-primary" onClick={() => saveArea(area)} disabled={saving}><FaSave /> Save</button>
              <button type="button" className="btn btn-outline-danger" onClick={() => removeArea(area)} aria-label={`Remove ${area.name}`}><FaTrash /></button>
            </div>
          </article>
        ))}
        {!loading && !areas.length && <div className="admin-empty-small">No delivery areas yet. Add an area above to make it available at checkout.</div>}
      </div>
    </div>
  );
}
