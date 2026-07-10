      // $ is defined in role-pages.js

      // ============ SECTION SWITCHING ============
      function switchSection(name) {
        document.querySelectorAll(".section-panel").forEach(function (el) {
          el.classList.add("hidden");
        });
        var target = $("section-" + name);
        if (target) target.classList.remove("hidden");
        document
          .querySelectorAll(".nav-btn[data-section]")
          .forEach(function (btn) {
            btn.classList.remove("active");
          });
        var activeBtn = document.querySelector(
          '.nav-btn[data-section="' + name + '"]',
        );
        if (activeBtn) activeBtn.classList.add("active");
        if (window.innerWidth < 1024) toggleSidebar();
        if (name === "map-navigation" && typeof map !== "undefined") {
          setTimeout(function () {
            focusProfileBarangay();
          }, 100);
        }
      }

      function toggleSidebar() {
        document.querySelector("main aside").classList.toggle("open");
        document.getElementById("sidebarOverlay").classList.toggle("open");
      }

      function timeAgo(date) {
        if (!date) return "";
        var now = new Date();
        var diff = now - (typeof date === "string" ? new Date(date) : date);
        var mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return mins + "m ago";
        var hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + "h ago";
        var days = Math.floor(hrs / 24);
        if (days < 7) return days + "d ago";
        return Math.floor(days / 7) + "w ago";
      }

      var profileBarangayBounds = null;
      var profileBarangayCenter = null;
      var profileBarangaySearchLayer = null;
      var sentinelLayerGroup =
        typeof L !== "undefined" ? L.layerGroup().addTo(map) : null;
      var loadedSentinelDevices = [];
      var operationSentinels = [];
      var mapLayerVisibility = {
        routes: true,
        sentinels: true,
        scope: true,
        search: true,
      };

      function setLayerOnMap(layer, visible) {
        if (!layer) return;
        if (visible) {
          if (!map.hasLayer(layer)) layer.addTo(map);
        } else if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }

      function applyMapLayerVisibility() {
        setLayerOnMap(drawnItems, mapLayerVisibility.routes);
        setLayerOnMap(sentinelLayerGroup, mapLayerVisibility.sentinels);
        setLayerOnMap(profileBarangaySearchLayer, mapLayerVisibility.scope);
        setLayerOnMap(zoneSearchLayer, mapLayerVisibility.search);
      }

       function renderMapSentinels(devices) {
         if (!sentinelLayerGroup) return;
         loadedSentinelDevices = devices || loadedSentinelDevices || [];
         sentinelLayerGroup.clearLayers();
         loadedSentinelDevices.forEach(function (device, index) {
           if (toNumber(device.lat) === null || toNumber(device.lng) === null)
             return;
           var marker = L.marker([Number(device.lat), Number(device.lng)]);
           device._mapKey = getSentinelDeviceKey(device, index);
           device._operationsMarker = marker;
           marker.bindPopup(renderSentinelDetailsCard(device));
           marker.addTo(sentinelLayerGroup);
         });
         operationSentinels.forEach(function (sentinel) {
           var currentUser = user && user.id ? user : JSON.parse(localStorage.getItem("user") || "{}");
           var allUsers = window._allUsers || [];
           var creator = sentinel.createdBy ? allUsers.find(function(u) { return u.id === sentinel.createdBy; }) : null;
           var isOnline = creator && creator.lastSeenAt ? new Date() - new Date(creator.lastSeenAt) < 60000 : false;
           var userRole = creator ? creator.role || "admin" : "admin";
           var showToOthers = isOnline || (sentinel.createdBy && sentinel.createdBy === currentUser.id);
           if (showToOthers) {
             addSentinelMarkerToLayer(sentinel, isOnline, userRole);
           }
         });
         applyMapLayerVisibility();
         renderOperationSentinelCards();
       }

      function setupMapLayerFilters() {
        document
          .querySelectorAll("[data-layer-filter]")
          .forEach(function (input) {
            mapLayerVisibility[input.getAttribute("data-layer-filter")] =
              input.checked;
            input.addEventListener("change", function () {
              mapLayerVisibility[input.getAttribute("data-layer-filter")] =
                input.checked;
              applyMapLayerVisibility();
            });
          });
      }
      setupMapLayerFilters();

      function toNumber(value) {
        var number = Number(value);
        return Number.isFinite(number) ? number : null;
      }

      function addMapPoint(points, lat, lng) {
        lat = toNumber(lat);
        lng = toNumber(lng);
        if (lat === null || lng === null) return;
        points.push([lat, lng]);
      }

      function collectGeojsonPoints(geojson, points) {
        if (!geojson) return;
        var parsed = geojson;
        if (typeof geojson === "string") {
          try {
            parsed = JSON.parse(geojson);
          } catch (_) {
            return;
          }
        }
        function walk(value) {
          if (!Array.isArray(value)) return;
          if (
            value.length >= 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
          ) {
            addMapPoint(points, value[1], value[0]);
            return;
          }
          value.forEach(walk);
        }
        if (parsed.type === "FeatureCollection")
          parsed.features.forEach(function (feature) {
            collectGeojsonPoints(feature.geometry, points);
          });
        else if (parsed.type === "Feature")
          collectGeojsonPoints(parsed.geometry, points);
        else if (parsed.coordinates) walk(parsed.coordinates);
      }

      function setProfileBarangayViewport(barangay) {
        var points = [];
        if (barangay) {
          addMapPoint(points, barangay.centerLat, barangay.centerLng);
          collectGeojsonPoints(barangay.boundaryGeojson, points);
        }

        profileBarangayCenter =
          barangay &&
          toNumber(barangay.centerLat) !== null &&
          toNumber(barangay.centerLng) !== null
            ? [Number(barangay.centerLat), Number(barangay.centerLng)]
            : points[0] || null;
        profileBarangayBounds = points.length ? L.latLngBounds(points) : null;
        focusProfileBarangay();
      }

      function getBarangaySearchName(barangay) {
        if (!barangay || !barangay.name) return "";
        var city = barangay.city || "Valenzuela City";
        var name =
          barangay.name.toLowerCase().indexOf("barangay") === 0
            ? barangay.name
            : "Barangay " + barangay.name;
        return name + ", " + city + ", Philippines";
      }

      function focusProfileBarangay() {
        if (typeof map === "undefined") return;
        map.invalidateSize();
        if (profileBarangayBounds && profileBarangayBounds.isValid()) {
          map.fitBounds(profileBarangayBounds.pad(0.28), {
            paddingTopLeft: [56, 92],
            paddingBottomRight: [56, 56],
            maxZoom: 15,
          });
          return;
        }
        if (profileBarangayCenter) {
          map.setView(profileBarangayCenter, 15);
          return;
        }
        map.fitBounds(scopeBounds, { padding: [30, 30], maxZoom: 14 });
      }

      function fitProfileLayerBounds(layer) {
        if (!layer || !layer.getBounds) return;
        map.invalidateSize();
        map.fitBounds(layer.getBounds(), {
          paddingTopLeft: [64, 104],
          paddingBottomRight: [64, 64],
          maxZoom: 15,
        });
      }

      function isCompactBarangayBounds(bounds) {
        if (!bounds || !bounds.isValid()) return false;
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        return (
          Math.abs(northEast.lat - southWest.lat) <= 0.035 &&
          Math.abs(northEast.lng - southWest.lng) <= 0.035
        );
      }

      function makeProfileBarangayLayer(barangay, result) {
        var style = {
          color: "#0f172a",
          weight: 4,
          opacity: 0.95,
          dashArray: "8 6",
          fillColor: "#14b8a6",
          fillOpacity: 0.18,
        };
        if (
          result &&
          result.geojson &&
          (result.geojson.type === "Polygon" ||
            result.geojson.type === "MultiPolygon")
        ) {
          var searchBoundary = L.geoJSON(result.geojson, { style: style });
          if (isCompactBarangayBounds(searchBoundary.getBounds()))
            return searchBoundary;
        }
        if (result && result.boundingbox) {
          var searchBounds = L.latLngBounds([
            [+result.boundingbox[0], +result.boundingbox[2]],
            [+result.boundingbox[1], +result.boundingbox[3]],
          ]);
          if (isCompactBarangayBounds(searchBounds)) {
            return L.rectangle(searchBounds, style);
          }
        }
        if (
          result &&
          toNumber(result.lat) !== null &&
          toNumber(result.lon) !== null
        ) {
          return L.circle([Number(result.lat), Number(result.lon)], {
            radius: 850,
            color: style.color,
            weight: style.weight,
            opacity: style.opacity,
            dashArray: style.dashArray,
            fillColor: style.fillColor,
            fillOpacity: style.fillOpacity,
          });
        }
        if (!barangay) return null;
        if (barangay.boundaryGeojson) {
          try {
            var geojson =
              typeof barangay.boundaryGeojson === "string"
                ? JSON.parse(barangay.boundaryGeojson)
                : barangay.boundaryGeojson;
            var boundaryLayer = L.geoJSON(geojson, { style: style });
            if (isCompactBarangayBounds(boundaryLayer.getBounds()))
              return boundaryLayer;
          } catch (_) {}
        }
        if (
          toNumber(barangay.centerLat) === null ||
          toNumber(barangay.centerLng) === null
        )
          return null;
        return L.circle(
          [Number(barangay.centerLat), Number(barangay.centerLng)],
          {
            radius: 850,
            color: style.color,
            weight: style.weight,
            opacity: style.opacity,
            dashArray: style.dashArray,
            fillColor: style.fillColor,
            fillOpacity: style.fillOpacity,
          },
        );
      }

      function showProfileBarangayLayer(barangay) {
        if (!profileBarangaySearchLayer) {
          focusProfileBarangay();
          return false;
        }
        profileBarangaySearchLayer.addTo(map);
        if (profileBarangaySearchLayer.bringToFront)
          profileBarangaySearchLayer.bringToFront();
        applyMapLayerVisibility();
        fitProfileLayerBounds(profileBarangaySearchLayer);
        return true;
      }

      function focusProfileBarangaySearch(barangay) {
        if (!barangay) return false;
        var query = getBarangaySearchName(barangay);
        var input = document.getElementById("zoneSearch");
        if (input) input.value = barangay.name || query;
        if (profileBarangaySearchLayer)
          map.removeLayer(profileBarangaySearchLayer);
        if (!query || typeof fetch !== "function") {
          profileBarangaySearchLayer = makeProfileBarangayLayer(barangay);
          return showProfileBarangayLayer(barangay);
        }

        return fetch(
          "https://nominatim.openstreetmap.org/search?format=json&q=" +
            encodeURIComponent(query) +
            "&limit=1&countrycodes=ph&polygon_geojson=1",
        )
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            profileBarangaySearchLayer = makeProfileBarangayLayer(
              barangay,
              data && data[0],
            );
            return showProfileBarangayLayer(barangay);
          })
          .catch(function () {
            profileBarangaySearchLayer = makeProfileBarangayLayer(barangay);
            return showProfileBarangayLayer(barangay);
          });
      }

      // ============ LOGOUT ============
      function logout() {
        document.getElementById("logoutModal").classList.remove("hidden");
        document.getElementById("logoutModal").classList.add("flex");
      }
      function confirmLogout() {
        localStorage.removeItem("user");
        window.location.href = "/login/barangay";
      }
      function cancelLogout() {
        document.getElementById("logoutModal").classList.add("hidden");
        document.getElementById("logoutModal").classList.remove("flex");
      }

      // ============ DRAW CONTROL ============
      var drawnItems = new L.FeatureGroup().addTo(map);
      var operationRoutes = [];
      var routeDraw = null;
      var sentinelDraw = null;
      var sentinelDrawActive = false;
      var drawActive = false;

      function setRouteButtonActive(active) {
        var btn = document.getElementById("drawToggle");
        drawActive = active;
        if (!btn) return;
        if (active)
          btn.classList.add("bg-teal-50", "text-teal-700", "border-teal-300");
        else
          btn.classList.remove(
            "bg-teal-50",
            "text-teal-700",
            "border-teal-300",
          );
      }

      function toggleDraw() {
        if (sentinelDrawActive && sentinelDraw) {
          sentinelDraw.disable();
          setSentinelButtonActive(false);
        }
        if (drawActive) {
          if (routeDraw) routeDraw.disable();
          setRouteButtonActive(false);
          return;
        }
        routeDraw = new L.Draw.Polyline(map, {
          shapeOptions: { color: "#059669", weight: 4, opacity: 0.9 },
        });
        setRouteButtonActive(true);
        routeDraw.enable();
      }

      function setSentinelButtonActive(active) {
        var btn = document.getElementById("sentinelAddToggle");
        sentinelDrawActive = active;
        if (!btn) return;
        if (active)
          btn.classList.add(
            "bg-purple-50",
            "text-purple-700",
            "border-purple-300",
          );
        else
          btn.classList.remove(
            "bg-purple-50",
            "text-purple-700",
            "border-purple-300",
          );
      }

      function startAddSentinel() {
        if (drawActive && routeDraw) {
          routeDraw.disable();
          setRouteButtonActive(false);
        }
        if (sentinelDrawActive && sentinelDraw) {
          sentinelDraw.disable();
          setSentinelButtonActive(false);
          return;
        }
        sentinelDraw = new L.Draw.Marker(map);
        setSentinelButtonActive(true);
        sentinelDraw.enable();
      }

      function routeStorageKey() {
        var storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return (
          "barangayOperationRoutes:" + (storedUser.barangayId || "default")
        );
      }

      function routeGeometryLabel(layer) {
        if (layer instanceof L.Rectangle) return "Boundary route";
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon))
          return "Line route";
        if (layer instanceof L.Polygon) return "Area route";
        if (layer instanceof L.Marker) return "Point route";
        return "Map route";
      }

      function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
          return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          }[char];
        });
      }

      function sentinelRiskFromBattery(level) {
        var battery = toNumber(level);
        if (battery === null) battery = 0;
        if (battery < 20) return "critical";
        if (battery < 50) return "high";
        if (battery < 75) return "moderate";
        return "low";
      }

      var sentinelRiskLabel = {
        critical: "Critical",
        high: "High",
        moderate: "Moderate",
        low: "Low",
      };

      function normalizeSentinelRisk(value, batteryLevel) {
        return sentinelRiskLabel[value] ? value : sentinelRiskFromBattery(batteryLevel);
      }

      function getSentinelDeviceKey(device, index) {
        return String(
          device.id ||
            device.deviceCode ||
            device.name ||
            device.code ||
            "device-" + index,
        );
      }

      function formatBattery(level) {
        var battery = toNumber(level);
        return battery === null ? "--" : Math.round(battery);
      }

      function jsString(value) {
        return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      }

      function batteryBarWidth(level) {
        var battery = toNumber(level);
        return battery === null ? 100 : Math.max(0, Math.min(100, battery));
      }

      function latestSentinelReading(device) {
        var list = device && Array.isArray(device.readings) ? device.readings : [];
        return list.length ? list[0] : null;
      }

      function batteryHealthLabel(level) {
        var battery = toNumber(level);
        if (battery === null) return "Unknown";
        if (battery >= 75) return "Good";
        if (battery >= 50) return "Fair";
        if (battery >= 20) return "Low";
        return "Critical";
      }

      function sentinelReadingAndBattery(device) {
        var reading = latestSentinelReading(device);
        var readingText = reading && reading.recordedAt ? timeAgo(reading.recordedAt) : "No readings";
        var battery = formatBattery(device.batteryLevel);
        var health = batteryHealthLabel(device.batteryLevel);
        return (
          '<div class="sentinel-readings">' +
          '<span class="reading-pill">📊 Reading: ' + escapeHtml(readingText) + '</span>' +
          '<span class="reading-pill">🔋 Battery: ' + battery + '% (' + health + ')</span>' +
          '</div>'
        );
      }

      function operationMapScope() {
        var currentUser = user && user.id ? user : JSON.parse(localStorage.getItem("user") || "{}");
        var scopeBarangayId = currentUser.barangayId || barangayId;
        if (!currentUser.id || !scopeBarangayId) return null;
        return {
          createdBy: currentUser.id,
          barangayId: scopeBarangayId,
        };
      }

      function operationMapQuery() {
        var scope = operationMapScope();
        if (!scope) return "";
        return (
          "?barangayId=" +
          encodeURIComponent(scope.barangayId) +
          "&createdBy=" +
          encodeURIComponent(scope.createdBy)
        );
      }

      function operationMapPayload(data) {
        var scope = operationMapScope();
        if (!scope) return null;
        return Object.assign({}, data, scope);
      }

      var pendingRemoveAction = null;

      function openRemoveConfirmModal(title, message, action) {
        pendingRemoveAction = typeof action === "function" ? action : null;
        var modal = document.getElementById("removeConfirmModal");
        var titleNode = document.getElementById("removeConfirmTitle");
        var textNode = document.getElementById("removeConfirmText");
        if (titleNode) titleNode.textContent = title || "Remove item?";
        if (textNode) textNode.textContent = message || "This action cannot be undone.";
        if (!modal) {
          if (pendingRemoveAction) pendingRemoveAction();
          pendingRemoveAction = null;
          return;
        }
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }

      function closeRemoveConfirmModal() {
        pendingRemoveAction = null;
        var modal = document.getElementById("removeConfirmModal");
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }

      function confirmRemoveAction() {
        var action = pendingRemoveAction;
        pendingRemoveAction = null;
        var modal = document.getElementById("removeConfirmModal");
        if (modal) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }
        if (action) action();
      }

      function renderSentinelDetailsCard(device) {
        var risk = normalizeSentinelRisk(device.risk, device.batteryLevel);
        var name = device.deviceCode || device.name || "Sentinel";
        var status = device.status || "unknown";
        return (
          '<div class="sentinel-popup-card sentinel-card ' +
          risk +
          '"><div class="sentinel-head"><span class="sentinel-id">' +
          escapeHtml(name) +
          '</span><span class="sentinel-battery">🔋 ' +
          formatBattery(device.batteryLevel) +
          '%</span><span class="sentinel-badge ' +
          risk +
          '">' +
          sentinelRiskLabel[risk] +
          '</span></div><div class="sentinel-body"><span class="sentinel-zone">' +
          escapeHtml(status) +
          '</span></div>' +
          sentinelReadingAndBattery(device) +
          '<div class="sentinel-bar ' +
          risk +
          '" style="width:' +
          batteryBarWidth(device.batteryLevel) +
          '%"></div></div>'
        );
      }

      function sentinelStorageKey() {
        var storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return (
          "barangayOperationSentinels:" + (storedUser.barangayId || "default")
        );
      }

      function saveOperationSentinels() {
        var data = operationSentinels.map(function (sentinel) {
          return {
            id: sentinel.id,
            serverId: sentinel.serverId || null,
            name: sentinel.name,
            lat: sentinel.lat,
            lng: sentinel.lng,
            createdAt: sentinel.createdAt,
            status: sentinel.status || "active",
            purpose: sentinel.purpose || "",
            createdBy: sentinel.createdBy || "",
          };
        });
        localStorage.setItem(
          sentinelStorageKey(),
          JSON.stringify(data),
        );
      }

      function persistOperationSentinel(sentinel) {
        var payload = operationMapPayload({
          name: sentinel.name,
          lat: sentinel.lat,
          lng: sentinel.lng,
          purpose: sentinel.purpose || "",
          status: sentinel.status || "active",
        });
        if (!payload) return;
        fetch("/api/v1/operation-map/sentinels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (res) {
            var saved = res && (res.data || res);
            if (saved && saved.id) {
              sentinel.serverId = saved.id;
              saveOperationSentinels();
              renderOperationSentinelCards();
            }
          })
          .catch(function () {});
      }

      function removeServerSentinel(serverId) {
        var query = operationMapQuery();
        if (!serverId || !query) return;
        fetch("/api/v1/operation-map/sentinels/" + serverId + query, {
          method: "DELETE",
        }).catch(function () {});
      }

      function loadServerSentinels() {
        var query = operationMapQuery();
        if (!query) return;
        fetch("/api/v1/operation-map/sentinels" + query)
          .then(function (r) {
            return r.json();
          })
          .then(function (res) {
            var list = (res && (res.data || res)) || [];
            if (!Array.isArray(list)) return;
            var knownServerIds = {};
            operationSentinels.forEach(function (s) {
              if (s.serverId) knownServerIds[s.serverId] = true;
            });
            list.forEach(function (srv) {
              if (!srv || srv.id == null) return;
              if (knownServerIds[srv.id]) return;
              operationSentinels.push({
                id: "sentinel-server-" + srv.id,
                serverId: srv.id,
                name: srv.name,
                lat: Number(srv.lat),
                lng: Number(srv.lng),
                createdAt: srv.createdAt,
                status: "active",
                purpose: "",
                createdBy: srv.createdBy,
              });
            });
            saveOperationSentinels();
            renderMapSentinels(loadedSentinelDevices);
          })
          .catch(function () {});
      }

function addSentinelMarkerToLayer(sentinel, isOnline, userRole) {
        if (
          !sentinelLayerGroup ||
          toNumber(sentinel.lat) === null ||
          toNumber(sentinel.lng) === null
        )
          return;
        var status = isOnline ? 'ONLINE - ' + userRole : 'OFFLINE';
        var statusColor = isOnline ? 'status-online' : 'status-offline';
        sentinel.marker = L.marker([Number(sentinel.lat), Number(sentinel.lng)])
          .bindPopup(
            '<div class="sentinel-popup-card sentinel-card ' + statusColor + '"><div class="sentinel-head"><span class="sentinel-id">' + escapeHtml(sentinel.name || "Sentinel") + '</span><span class="sentinel-badge ' + statusColor + '">' + status + '</span></div><div class="sentinel-body">' + (sentinel.purpose ? '<strong class="sentinel-purpose">' + escapeHtml(sentinel.purpose) + '</strong>' : '') + '</div></div>',
          )
          .addTo(sentinelLayerGroup);
      }

      function focusSentinelDevice(key) {
        var device = loadedSentinelDevices.find(function (item, index) {
          return getSentinelDeviceKey(item, index) === key;
        });
        if (!device || toNumber(device.lat) === null || toNumber(device.lng) === null) return;
        if (!mapLayerVisibility.sentinels) {
          var filter = document.querySelector('[data-layer-filter="sentinels"]');
          if (filter) filter.checked = true;
          mapLayerVisibility.sentinels = true;
          applyMapLayerVisibility();
        }
        map.setView([Number(device.lat), Number(device.lng)], 18);
        if (device._operationsMarker) device._operationsMarker.openPopup();
      }

      function focusOperationSentinel(id) {
        var sentinel = operationSentinels.find(function (item) { return item.id === id; });
        if (!sentinel || toNumber(sentinel.lat) === null || toNumber(sentinel.lng) === null) return;
        if (!mapLayerVisibility.sentinels) {
          var filter = document.querySelector('[data-layer-filter="sentinels"]');
          if (filter) filter.checked = true;
          mapLayerVisibility.sentinels = true;
          applyMapLayerVisibility();
        }
        map.setView([Number(sentinel.lat), Number(sentinel.lng)], 18);
        if (sentinel.marker) sentinel.marker.openPopup();
      }

      function removeSentinelDevice(event, key) {
        if (event) event.stopPropagation();
        var target = loadedSentinelDevices.find(function (device, index) {
          return getSentinelDeviceKey(device, index) === key;
        });
        openRemoveConfirmModal("Remove sentinel?", "This sentinel will be permanently removed.", function () {
          function applyRemoval() {
            loadedSentinelDevices = loadedSentinelDevices.filter(function (device, index) {
              return getSentinelDeviceKey(device, index) !== key;
            });
            renderMapSentinels(loadedSentinelDevices);
          }
          if (target && target.id != null) {
            fetch("/api/v1/sentinel-devices/" + target.id, { method: "DELETE" })
              .then(function () {
                applyRemoval();
              })
              .catch(function () {
                applyRemoval();
              });
          } else {
            applyRemoval();
          }
        });
      }

      function removeOperationSentinel(event, id) {
        if (event) event.stopPropagation();
        var target = operationSentinels.find(function (sentinel) {
          return sentinel.id === id;
        });
        var serverId = target ? target.serverId : null;
        openRemoveConfirmModal("Delete sentinel marker?", "This marker will be removed from the map and saved list.", function () {
          if (serverId) removeServerSentinel(serverId);
          operationSentinels = operationSentinels.filter(function (sentinel) {
            return sentinel.id !== id;
          });
          saveOperationSentinels();
          renderMapSentinels(loadedSentinelDevices);
        });
      }

       function renderOperationSentinelCards() {
         var node = document.getElementById("sentinelGrid");
         if (!node) return;
          var deviceCards = loadedSentinelDevices.map(function (device, index) {
            if (toNumber(device.lat) === null || toNumber(device.lng) === null) return "";
            var key = getSentinelDeviceKey(device, index);
            var risk = normalizeSentinelRisk(device.risk, device.batteryLevel);
            return '<div class="sentinel-card ' + risk + ' text-left" role="button" tabindex="0" onclick="focusSentinelDevice(\'' + jsString(key) + '\')"><div class="sentinel-head"><span class="sentinel-id">' + escapeHtml(device.deviceCode || "Sentinel") + '</span><span class="sentinel-battery">🔋 ' + formatBattery(device.batteryLevel) + '%</span><button type="button" class="item-remove-btn" onclick="removeSentinelDevice(event, \'' + jsString(key) + '\')">Remove</button></div><div class="sentinel-body"><span class="sentinel-zone">' + escapeHtml(device.status || "unknown") + '</span>' + '</div>' + sentinelReadingAndBattery(device) + '<div class="sentinel-bar ' + risk + '" style="width:' + batteryBarWidth(device.batteryLevel) + '%"></div></div>';
          }).join("");
         var customCards = operationSentinels.map(function (sentinel) {
           var userName = "Unknown", isOnline = false, userRole = "admin";
           var currentUser = user && user.id ? user : JSON.parse(localStorage.getItem("user") || "{}");
           var allUsers = window._allUsers || [];
           if (sentinel.createdBy) {
             var creator = allUsers.find(function(u) { return u.id === sentinel.createdBy; });
             if (creator) {
               userName = creator.name || userName;
               userRole = creator.role || userRole;
               var lastSeenAt = creator.lastSeenAt ? new Date(creator.lastSeenAt) : null;
               isOnline = lastSeenAt && new Date() - lastSeenAt < 60000;
             }
           }
           var roleClass = userRole === "admin" ? "barangay-admin" : "public-user";
           var statusDisplay = isOnline 
             ? '<span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span><span class="text-emerald-600 text-xs font-medium">' + userName + ' (online - ' + userRole + ')</span></span>'
             : '<span class="text-slate-400 text-xs font-medium">' + userName + ' (offline - ' + userRole + ')</span>';
           var visibilityClass = isOnline ? "visible-to-all" : "hidden-from-others";
            var purposeText = sentinel.purpose || "";
            return '<div class="sentinel-card ' + roleClass + ' text-left ' + visibilityClass + '" role="button" tabindex="0" onclick="focusOperationSentinel(\'' + jsString(sentinel.id) + '\')"><div class="sentinel-head"><span class="sentinel-id">' + escapeHtml(sentinel.name || "Sentinel") + '</span><button type="button" class="item-remove-btn" onclick="removeOperationSentinel(event, \'' + jsString(sentinel.id) + '\')">Remove</button></div><div class="sentinel-body">' + (purposeText ? '<span class="sentinel-purpose">' + escapeHtml(purposeText) + '</span>' : '') + '</div><div class="sentinel-bar ' + (isOnline ? 'moderate' : 'low') + '"></div><div class="sentinel-status">' + statusDisplay + '</div></div>';
         }).join("");
        node.innerHTML =
          deviceCards || customCards
            ? deviceCards + customCards
            : '<p class="text-sm text-slate-400 py-4 text-center">No devices.</p>';
      }

       function addOperationSentinel(latlng, name, purpose) {
         var currentUser = user && user.id ? user : JSON.parse(localStorage.getItem("user") || "{}");
         var sentStatus = "active"; // Default status
         var sentEpoch = Date.now(); // Timestamp for storage
         var sentinel = {
           id: "sentinel-" + sentEpoch + "-" + Math.floor(Math.random() * 1000),
           serverId: null,
           name: name,
           lat: latlng.lat,
           lng: latlng.lng,
           createdAt: new Date().toISOString(),
           status: sentStatus,
            purpose: purpose || "",
           createdBy: currentUser.id || "guest",
         };
         operationSentinels.push(sentinel);
         saveOperationSentinels();
         renderMapSentinels(loadedSentinelDevices);
         persistOperationSentinel(sentinel);
       }

       function restoreOperationSentinels() {
         try {
           operationSentinels = JSON.parse(
             localStorage.getItem(sentinelStorageKey()) || "[]",
           ).map(function (sentinel) {
             return {
               id: sentinel.id,
               serverId: sentinel.serverId || null,
               name: sentinel.name,
               lat: sentinel.lat,
               lng: sentinel.lng,
               createdAt: sentinel.createdAt,
               status: sentinel.status || "active",
                purpose: sentinel.purpose || "",
               createdBy: sentinel.createdBy || "",
             };
           });
         } catch (_) {
           operationSentinels = [];
         }
         renderMapSentinels(loadedSentinelDevices);
         loadServerSentinels();
       }

      function saveOperationRoutes() {
        var data = operationRoutes.map(function (route) {
          return {
            id: route.id,
            name: route.name,
            type: route.type,
            geojson: route.geojson,
            createdAt: route.createdAt,
          };
        });
        localStorage.setItem(routeStorageKey(), JSON.stringify(data));
      }

      function routeBounds(layer) {
        if (layer.getBounds) return layer.getBounds();
        if (layer.getLatLng) return L.latLngBounds([layer.getLatLng()]);
        return null;
      }

      function focusOperationRoute(id) {
        var route = operationRoutes.find(function (item) {
          return item.id === id;
        });
        if (!route) return;
        var bounds = routeBounds(route.layer);
        if (bounds && bounds.isValid())
          map.fitBounds(bounds.pad(0.25), { padding: [40, 40], maxZoom: 18 });
      }

      function removeOperationRoute(event, id) {
        if (event) event.stopPropagation();
        openRemoveConfirmModal("Delete route?", "This route will be removed from the map and saved list.", function () {
          var route = operationRoutes.find(function (item) {
            return item.id === id;
          });
          if (route && route.layer) drawnItems.removeLayer(route.layer);
          operationRoutes = operationRoutes.filter(function (item) {
            return item.id !== id;
          });
          saveOperationRoutes();
          renderOperationRoutes();
        });
      }

      function renderOperationRoutes() {
        var list = document.getElementById("routesList");
        var count = document.getElementById("routesCount");
        if (count) count.textContent = String(operationRoutes.length);
        if (!list) return;
        if (!operationRoutes.length) {
          list.innerHTML =
            '<p class="text-sm text-slate-400">No routes drawn yet.</p>';
          return;
        }
        list.innerHTML = operationRoutes
          .map(function (route) {
            return (
              '<div class="route-card" role="button" tabindex="0" onclick="focusOperationRoute(\'' +
              jsString(route.id) +
              '\')"><span><span class="route-name">' +
              escapeHtml(route.name) +
              '</span><span class="route-meta">' +
              escapeHtml(route.type) +
              '</span></span><button type="button" class="item-remove-btn" onclick="removeOperationRoute(event, \'' +
              jsString(route.id) +
              '\')">Remove</button></div>'
            );
          })
          .join("");
      }

      function addOperationRoute(layer, data) {
        var route = {
          id:
            data.id ||
            "route-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          name: data.name,
          type: data.type || routeGeometryLabel(layer),
          geojson: data.geojson || layer.toGeoJSON(),
          createdAt: data.createdAt || new Date().toISOString(),
          layer: layer,
        };
        layer.options = layer.options || {};
        if (layer.setStyle)
          layer.setStyle({ color: "#059669", weight: 4, opacity: 0.9 });
        drawnItems.addLayer(layer);
        operationRoutes.push(route);
        saveOperationRoutes();
        renderOperationRoutes();
        applyMapLayerVisibility();
      }

      function restoreOperationRoutes() {
        var saved = [];
        try {
          saved = JSON.parse(localStorage.getItem(routeStorageKey()) || "[]");
        } catch (_) {
          saved = [];
        }
        saved.forEach(function (route) {
          if (!route.geojson) return;
          var restored = L.geoJSON(route.geojson, {
            style: { color: "#059669", weight: 4, opacity: 0.9 },
            pointToLayer: function (_feature, latlng) {
              return L.marker(latlng);
            },
          });
          restored.eachLayer(function (layer) {
            addOperationRoute(layer, route);
          });
        });
        renderOperationRoutes();
      }

      map.on(L.Draw.Event.CREATED, function (e) {
        if (sentinelDrawActive) {
          setSentinelButtonActive(false);
          if (!(e.layer instanceof L.Marker) || !e.layer.getLatLng) return;
          var latlng = e.layer.getLatLng();
          var defaultSentinelName =
            "Sentinel " + (operationSentinels.length + 1);
          var sentinelName = prompt("Name this sentinel", defaultSentinelName);
          if (sentinelName === null) return;
          addOperationSentinel(
            latlng,
            sentinelName.trim() || defaultSentinelName,
          );
          return;
        }
        setRouteButtonActive(false);
        if (!(e.layer instanceof L.Polyline) || e.layer instanceof L.Polygon)
          return;
        var defaultName = "Route " + (operationRoutes.length + 1);
        var routeName = prompt("Name this route", defaultName);
        if (routeName === null) return;
        routeName = routeName.trim() || defaultName;
        addOperationRoute(e.layer, {
          name: routeName,
          type: routeGeometryLabel(e.layer),
          geojson: e.layer.toGeoJSON(),
        });
      });
      map.on(L.Draw.Event.DRAWSTOP, function () {
        if (sentinelDrawActive) setSentinelButtonActive(false);
        if (drawActive) setRouteButtonActive(false);
      });
      restoreOperationRoutes();
      restoreOperationSentinels();

      // ============ MAP STYLE TOGGLE ============
      var currentStyle = "street";
      function setStreetMapDefault() {
        var btn = document.getElementById("mapStyleToggle");
        var toRemove = [];
        map.eachLayer(function (l) {
          if (l instanceof L.TileLayer) toRemove.push(l);
        });
        toRemove.forEach(function (l) {
          map.removeLayer(l);
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
        if (btn) {
          btn.innerHTML =
            '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Street';
        }
      }
      setStreetMapDefault();
      function toggleMapStyle() {
        var btn = document.getElementById("mapStyleToggle");
        var toRemove = [];
        map.eachLayer(function (l) {
          if (l instanceof L.TileLayer) toRemove.push(l);
        });
        toRemove.forEach(function (l) {
          map.removeLayer(l);
        });
        if (currentStyle === "satellite") {
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map);
          currentStyle = "street";
          btn.innerHTML =
            '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Street';
          btn.className = btn.className.replace(
            /hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700/g,
            "",
          );
          btn.classList.add(
            "hover:border-emerald-300",
            "hover:bg-emerald-50",
            "hover:text-emerald-700",
          );
        } else {
          L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              maxZoom: 19,
              attribution: "&copy; Esri, Maxar, Earthstar Geographics",
            },
          ).addTo(map);
          currentStyle = "satellite";
          btn.innerHTML =
            '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Satellite';
          btn.className = btn.className.replace(
            /hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700/g,
            "",
          );
          btn.classList.add(
            "hover:border-blue-300",
            "hover:bg-blue-50",
            "hover:text-blue-700",
          );
        }
      }

      // ============ ZONE SEARCH ============
      function showDropdown() {
        document.getElementById("zoneDropdown").classList.remove("hidden");
      }
      function hideDropdown() {
        document.getElementById("zoneDropdown").classList.add("hidden");
      }
      var zoneSearchLayer = null;
      var zoneSearchTargets = [
        {
          name: "School drainage",
          keywords: ["school", "drainage", "ovi-a", "drainage canal"],
          pos: [14.68065, 120.9748],
          radius: 150,
        },
        {
          name: "General Luna canal",
          keywords: ["general luna", "canal", "ovi-a2"],
          pos: [14.68105, 120.9741],
          radius: 150,
        },
        {
          name: "Sampaguita",
          keywords: ["sampaguita", "ovi-a3"],
          pos: [14.6797, 120.97355],
          radius: 150,
        },
        {
          name: "Mabini cluster",
          keywords: ["mabini", "cluster", "ovi-c1"],
          pos: [14.68255, 120.97245],
          radius: 150,
        },
        {
          name: "J.P. Rizal",
          keywords: ["j.p. rizal", "jp rizal", "rizal", "ovi-b"],
          pos: [14.68275, 120.9769],
          radius: 150,
        },
        {
          name: "Transmitter site",
          keywords: ["transmitter", "tower", "ovi-d"],
          pos: [14.67925, 120.97675],
          radius: 150,
        },
        {
          name: "Citizen report",
          keywords: ["report", "citizen report", "larvae"],
          pos: [14.68088, 120.97415],
          radius: 120,
        },
        {
          name: "Inspection task",
          keywords: ["task", "inspection", "inspect"],
          pos: [14.68105, 120.9744],
          radius: 120,
        },
      ];

      function setProfileZoneTargets(areas, devices, reports) {
        var targets = [];
        (areas || []).forEach(function (area) {
          var name = area.name || "Area #" + area.id;
          targets.push({
            name: name,
            keywords: [
              name.toLowerCase(),
              String(area.type || "").replace(/_/g, " "),
              "area " + area.id,
            ],
            pos: [Number(area.centerLat), Number(area.centerLng)],
            radius: area.priority === "critical" ? 190 : 150,
          });
        });
        (devices || []).forEach(function (device) {
          var code = device.deviceCode || "Device #" + device.id;
          targets.push({
            name: code,
            keywords: [
              code.toLowerCase(),
              "sentinel",
              "ovitrap",
            ],
            pos: [Number(device.lat), Number(device.lng)],
            radius: 110,
          });
        });
        (reports || []).forEach(function (report) {
          targets.push({
            name: "Report #" + report.id,
            keywords: [
              "report " + report.id,
              "citizen report",
              String(report.description || "").toLowerCase(),
            ],
            pos: [Number(report.lat), Number(report.lng)],
            radius: 110,
          });
        });
        targets = targets.filter(function (target) {
          return (
            Number.isFinite(target.pos[0]) && Number.isFinite(target.pos[1])
          );
        });
        if (targets.length) zoneSearchTargets = targets;
      }

      function focusBoundary(layer) {
        if (layer.getBounds) {
          map.fitBounds(layer.getBounds(), { padding: [32, 32], maxZoom: 18 });
          return;
        }
        if (layer.getLatLng)
          map.flyTo(layer.getLatLng(), 18, { duration: 0.8 });
      }

      function clearZoneSearchLayer() {
        if (zoneSearchLayer) {
          map.removeLayer(zoneSearchLayer);
          zoneSearchLayer = null;
        }
      }

      function findLocalZone(query) {
        var q = query.toLowerCase();
        return zoneSearchTargets.find(function (target) {
          return (
            target.name.toLowerCase().includes(q) ||
            target.keywords.some(function (keyword) {
              return keyword.includes(q) || q.includes(keyword);
            })
          );
        });
      }

      function focusLocalZone(target) {
        clearZoneSearchLayer();
        zoneSearchLayer = L.circle(target.pos, {
          radius: target.radius,
          color: "#0f766e",
          weight: 3,
          fillColor: "#14b8a6",
          fillOpacity: 0.12,
        }).addTo(map);
        applyMapLayerVisibility();
        focusBoundary(zoneSearchLayer);
      }

      function renderZoneDropdown() {
        var input = document.getElementById("zoneSearch");
        var dropdown = document.getElementById("zoneDropdown");
        var q = input.value.trim().toLowerCase();
        if (!q) {
          dropdown.innerHTML = "";
          hideDropdown();
          return;
        }
        var matches = zoneSearchTargets
          .filter(function (target) {
            return (
              target.name.toLowerCase().includes(q) ||
              target.keywords.some(function (keyword) {
                return keyword.includes(q) || q.includes(keyword);
              })
            );
          })
          .slice(0, 6);
        if (!matches.length) {
          dropdown.innerHTML =
            '<div class="px-3 py-2 text-sm text-slate-400">Press Enter to search online</div>';
          showDropdown();
          return;
        }
        dropdown.innerHTML = matches
          .map(function (target) {
            return (
              '<button type="button" class="block w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700" data-zone="' +
              target.name +
              '">' +
              target.name +
              "</button>"
            );
          })
          .join("");
        showDropdown();
      }

      function searchOnMap() {
        var q = document.getElementById("zoneSearch").value.trim();
        if (!q) return;
        hideDropdown();
        var localTarget = findLocalZone(q);
        if (localTarget) {
          focusLocalZone(localTarget);
          return;
        }
        fetch(
          "https://nominatim.openstreetmap.org/search?format=json&q=" +
            encodeURIComponent(q) +
            "&limit=1&countrycodes=ph&polygon_geojson=1",
          {
            headers: { "User-Agent": "HEXA-Barangay/1.0" },
          },
        )
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            if (!data || data.length === 0) {
              alert("Location not found.");
              return;
            }
            var loc = data[0];
            var layer;
            clearZoneSearchLayer();
            if (loc.geojson && loc.geojson.type === "Polygon") {
              var coords = loc.geojson.coordinates[0].map(function (c) {
                return [c[1], c[0]];
              });
              layer = L.polygon(coords, {
                color: "#2563eb",
                weight: 2,
                fill: false,
                interactive: false,
              }).addTo(map);
            } else {
              var bounds = [
                [loc.boundingbox[0], loc.boundingbox[2]],
                [loc.boundingbox[1], loc.boundingbox[3]],
              ];
              layer = L.rectangle(bounds, {
                color: "#2563eb",
                weight: 2,
                fill: false,
                dashArray: "6 5",
                interactive: false,
              }).addTo(map);
            }
            zoneSearchLayer = layer;
            applyMapLayerVisibility();
            focusBoundary(layer);
          })
          .catch(function () {
            alert("Search failed. Try again.");
          });
      }

      document
        .getElementById("zoneDropdown")
        .addEventListener("click", function (event) {
          var button = event.target.closest("button[data-zone]");
          if (!button) return;
          var target = zoneSearchTargets.find(function (item) {
            return item.name === button.getAttribute("data-zone");
          });
          if (!target) return;
          document.getElementById("zoneSearch").value = target.name;
          hideDropdown();
          focusLocalZone(target);
        });

      var lockedZoneSearch = document.getElementById("zoneSearch");
      lockedZoneSearch.addEventListener("beforeinput", function (event) {
        event.preventDefault();
      });
      lockedZoneSearch.addEventListener("paste", function (event) {
        event.preventDefault();
      });
      lockedZoneSearch.addEventListener("cut", function (event) {
        event.preventDefault();
      });
      lockedZoneSearch.addEventListener("drop", function (event) {
        event.preventDefault();
      });
      lockedZoneSearch.addEventListener("keydown", function (event) {
        var allowed = [
          "Enter",
          "Tab",
          "Shift",
          "Control",
          "Alt",
          "Meta",
          "Escape",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ];
        if (allowed.indexOf(event.key) !== -1) return;
        event.preventDefault();
      });

      document.addEventListener("click", function (event) {
        if (
          !event.target.closest("#zoneSearch") &&
          !event.target.closest("#zoneDropdown")
        )
          hideDropdown();
      });

      function resetMapPanelLayout() {
        hideDropdown();
        var active = document.activeElement;
        if (active && active.blur) active.blur();
        if (typeof map !== "undefined") {
          map.closePopup();
          map.invalidateSize();
        }
        var card = document.getElementById("mapNavigationCard");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      document.addEventListener("pointerdown", function (event) {
        var mapSection = document.getElementById("section-map-navigation");
        if (!mapSection || mapSection.classList.contains("hidden")) return;
        if (event.target.closest("#roleMap")) return;
        if (
          event.target.closest("#zoneSearch") ||
          event.target.closest("#zoneDropdown")
        )
          return;
        if (event.target.closest("a[href]")) return;
        resetMapPanelLayout();
      });

      function toggleMenu(btn) {
        var dropdown = btn.nextElementSibling;
        var isHidden = dropdown.classList.contains("hidden");
        document.querySelectorAll(".inspector-dropdown").forEach(function (d) {
          d.classList.add("hidden");
        });
        if (isHidden) dropdown.classList.remove("hidden");
      }
      function changeInspector(id) {
        alert("Change inspector " + id);
      }
      function viewInspector(id) {
        var allUsers = window._allUsers || [];
        var u = allUsers.find(function (x) {
          return x.id === id;
        });
        if (!u) return alert("User not found");
        var parts = (u.name || "").split(" ");
        var first = parts[0] || "";
        var last = parts.slice(1).join(" ") || "";
        var overlay = document.createElement("div");
        overlay.className =
          "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm";
        overlay.id = "inspectorModal";
        overlay.innerHTML =
          '<div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><div class="flex items-center justify-between mb-5"><h3 class="font-display text-lg font-bold text-slate-900">Inspector Details</h3><button onclick="this.closest(\'#inspectorModal\').remove()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">&times;</button></div><div class="grid gap-4"><label class="grid gap-1 text-sm font-semibold text-slate-700">First Name<input id="modalFirstName" class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" value="' +
          first +
          '" /></label><label class="grid gap-1 text-sm font-semibold text-slate-700">Last Name<input id="modalLastName" class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" value="' +
          last +
          '" /></label><label class="grid gap-1 text-sm font-semibold text-slate-700">Email<input id="modalEmail" class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" value="' +
          (u.email || "") +
          '" /></label><hr class="border-slate-100" /><label class="grid gap-1 text-sm font-semibold text-slate-700">Change Password<input id="modalPassword" type="password" class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" placeholder="New password" /></label></div><div class="mt-6 flex justify-end gap-3"><button onclick="this.closest(\'#inspectorModal\').remove()" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">Save</button></div></div>';
        document.body.appendChild(overlay);
      }
      function deleteInspector(id) {
        openRemoveConfirmModal("Remove inspector?", "Inspector #" + id + " will be removed.", function () {
          alert("Inspector " + id + " removed");
        });
      }
      document.addEventListener("click", function (e) {
        if (!e.target.closest(".inspector-menu")) {
          document
            .querySelectorAll(".inspector-dropdown")
            .forEach(function (d) {
              d.classList.add("hidden");
            });
        }
      });

      // ============ API DATA LOADING ============
      var user = JSON.parse(localStorage.getItem("user") || "{}");
      var barangayId = user.barangayId;

      function fillProfile(barangayName) {
        var parts = (user.name || "").split(" ");
        var first = parts[0] || "";
        var last = parts.slice(1).join(" ") || "";
        if (user.name) {
          $("userName").textContent = "Barangay Admin " + user.name;
          $("profileNameDisplay").textContent = user.name;
          $("profileEmailDisplay").textContent = user.email || "";
          $("profileInitial").textContent = (user.name || "A")
            .charAt(0)
            .toUpperCase();
          $("profileFirstName").value = first;
          $("profileLastName").value = last;
          $("profileEmailInput").value = user.email || "";
          $("profileBarangay").value =
            barangayName || "Barangay #" + (user.barangayId || "?");
        }
      }
      fillProfile();

      function loadDashboard() {
        var userFetch = user.id
          ? fetch("/api/v1/users/" + user.id)
              .then(function (r) {
                return r.json();
              })
              .then(function (d) {
                if (d.data) {
                  user = d.data;
                  localStorage.setItem("user", JSON.stringify(user));
                  barangayId = user.barangayId;
                }
                return d;
              })
          : Promise.resolve(null);
        userFetch
          .then(function () {
            var bid = barangayId || 1;
            return Promise.all([
              fetch("/api/v1/dashboard/barangay/" + bid).then(function (r) {
                return r.json();
              }),
              fetch("/api/v1/sentinel-devices").then(function (r) {
                return r.json();
              }),
              fetch("/api/v1/tickets").then(function (r) {
                return r.json();
              }),
              fetch("/api/v1/users").then(function (r) {
                return r.json();
              }),
              fetch("/api/v1/barangays").then(function (r) {
                return r.json();
              }),
            ]).then(function (results) {
              return { results: results, bid: bid };
            });
          })
          .then(function (results) {
            var bid = results.bid;
            results = results.results;
            var dash = results[0].data || {};
            var allDevices = results[1].data || [];
            var tickets = results[2].data || [];
            var allUsers = results[3].data || [];
            var barangays = results[4].data || [];

            var areas = dash.areas || [];
            var tasks = dash.tasks || [];
            var reports = dash.reports || [];
            var effectiveBarangayId = barangayId || bid;
            var devices = effectiveBarangayId
              ? allDevices.filter(function (d) {
                  return d.barangayId === effectiveBarangayId;
                })
              : allDevices;
            var b = barangays.find(function (b) {
              return b.id === effectiveBarangayId;
            });
            setProfileBarangayViewport(b);
            setProfileZoneTargets(areas, devices, reports);
            renderMapSentinels(devices);
            focusProfileBarangaySearch(b);

            var criticalZ = areas.filter(function (a) {
              return a.priority === "critical";
            }).length;
            var openT = tasks.filter(function (t) {
              return t.status !== "completed";
            }).length;
            var activeD = devices.filter(function (d) {
              return d.status === "active";
            }).length;
            var recheck = tasks.filter(function (t) {
              return t.status === "in_progress" || t.status === "paused";
            }).length;

            $("dashboardMetrics").innerHTML = [
              { label: "Critical zones", value: criticalZ },
              { label: "Open tasks", value: openT },
              {
                label: "Sentinels online",
                value: devices.length ? activeD + " / " + devices.length : "—",
              },
              { label: "For recheck", value: recheck },
            ]
              .map(function (m) {
                return (
                  '<div class="metric-card"><div class="label">' +
                  m.label +
                  '</div><div class="value">' +
                  m.value +
                  "</div></div>"
                );
              })
              .join("");

            var priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };
            var sorted = tasks
              .slice()
              .sort(function (a, b) {
                return (
                  (priorityRank[a.priority] || 99) -
                  (priorityRank[b.priority] || 99)
                );
              })
              .slice(0, 5);
            $("dashboardTasks").innerHTML = sorted.length
              ? sorted
                  .map(function (t) {
                    return (
                      '<div class="task-card ' +
                      (t.priority || "low") +
                      '"><div class="task-title">' +
                      t.type.replace(/_/g, " ") +
                      " #" +
                      t.id +
                      '</div><div class="task-meta">' +
                      (t.priority || "—") +
                      " · " +
                      t.status +
                      (t.dueAt ? " · Due " + timeAgo(t.dueAt) : "") +
                      "</div></div>"
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400">No tasks assigned.</p>';

            var acts = [];
            reports.forEach(function (r) {
              acts.push({
                time: timeAgo(r.createdAt),
                label:
                  "Report #" +
                  r.id +
                  ": " +
                  (r.description || "").substring(0, 45),
                type: "report",
                ts: r.createdAt ? new Date(r.createdAt) : new Date(0),
              });
            });
            tasks.forEach(function (t) {
              acts.push({
                time: timeAgo(t.createdAt),
                label:
                  "Task #" +
                  t.id +
                  ": " +
                  t.type.replace(/_/g, " ") +
                  " — " +
                  t.status,
                type: "task",
                ts: t.createdAt ? new Date(t.createdAt) : new Date(0),
              });
            });
            acts.sort(function (a, b) {
              return b.ts - a.ts;
            });
            $("dashboardActivity").innerHTML =
              acts
                .slice(0, 8)
                .map(function (a) {
                  return (
                    '<div class="activity-item"><div class="activity-dot ' +
                    a.type +
                    '"></div><div class="activity-content"><p class="activity-text">' +
                    a.label +
                    '</p><span class="activity-time">' +
                    a.time +
                    "</span></div></div>"
                  );
                })
                .join("") ||
              '<p class="text-sm text-slate-400">No recent activity.</p>';

            var activeCount = devices.filter(function (d) {
              return d.status === "active";
            }).length;
            var maintCount = devices.filter(function (d) {
              return d.status === "needs_maintenance";
            }).length;
            var lowBattCount = devices.filter(function (d) {
              return (d.batteryLevel || 100) < 30;
            }).length;
            var onlineCount = devices.filter(function (d) {
              var l = d.lastSeenAt ? new Date(d.lastSeenAt) : null;
              return l && new Date() - l < 86400000;
            }).length;

            $("sentinelsMetrics").innerHTML = [
              {
                label: "Total Devices",
                value: devices.length,
                color: "text-slate-900",
              },
              {
                label: "Active",
                value: activeCount + " / " + devices.length,
                color: "text-emerald-600",
              },
              {
                label: "Online (24h)",
                value: onlineCount,
                color: "text-blue-600",
              },
              {
                label: "Low Battery",
                value: lowBattCount,
                color: "text-red-600",
              },
            ]
              .map(function (m) {
                return (
                  '<div class="metric-card"><div class="label">' +
                  m.label +
                  '</div><div class="value ' +
                  m.color +
                  '">' +
                  m.value +
                  "</div></div>"
                );
              })
              .join("");

            var bins = { critical: 0, low: 0, moderate: 0, good: 0 };
            devices.forEach(function (d) {
              var b = d.batteryLevel || 0;
              if (b < 20) bins.critical++;
              else if (b < 50) bins.low++;
              else if (b < 75) bins.moderate++;
              else bins.good++;
            });
            var binColors = {
              critical: "#ef4444",
              low: "#f97316",
              moderate: "#eab308",
              good: "#22c55e",
            };
            var binLabels = {
              critical: "Critical (<20%)",
              low: "Low (20-49%)",
              moderate: "Moderate (50-74%)",
              good: "Good (75-100%)",
            };
            var maxBin = Math.max(
              bins.critical,
              bins.low,
              bins.moderate,
              bins.good,
              1,
            );
            $("batteryDistribution").innerHTML =
              Object.keys(bins)
                .map(function (k) {
                  var pct = (bins[k] / maxBin) * 100;
                  return (
                    '<div><div class="flex items-center justify-between text-sm mb-1"><span class="font-medium text-slate-700">' +
                    binLabels[k] +
                    '</span><span class="font-semibold text-slate-900">' +
                    bins[k] +
                    '</span></div><div class="h-2.5 rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full transition-all" style="width:' +
                    pct +
                    "%;background:" +
                    binColors[k] +
                    '"></div></div></div>'
                  );
                })
                .join("") || '<p class="text-sm text-slate-400">No data</p>';

            var statuses = {};
            devices.forEach(function (d) {
              statuses[d.status] = (statuses[d.status] || 0) + 1;
            });
            var statusColors = {
              active: "#22c55e",
              needs_maintenance: "#f97316",
              planned: "#3b82f6",
              inactive: "#94a3b8",
            };
            var statusLabels = {
              active: "Active",
              needs_maintenance: "Needs Maintenance",
              planned: "Planned",
              inactive: "Inactive",
            };
            $("statusOverview").innerHTML = Object.keys(statuses).length
              ? Object.keys(statuses)
                  .map(function (s) {
                    var pct = (statuses[s] / devices.length) * 100;
                    return (
                      '<div class="flex items-center gap-3"><span class="inline-block w-3 h-3 rounded-full" style="background:' +
                      (statusColors[s] || "#94a3b8") +
                      '"></span><span class="flex-1 text-sm text-slate-700">' +
                      (statusLabels[s] || s) +
                      '</span><span class="text-sm font-semibold text-slate-900">' +
                      statuses[s] +
                      '</span><span class="text-xs text-slate-400 w-8 text-right">' +
                      Math.round(pct) +
                      "%</span></div>"
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400">No data</p>';

            var deviceRisk = function (bl) {
              if (bl < 20) return "critical";
              if (bl < 50) return "high";
              if (bl < 75) return "moderate";
              return "low";
            };
            var rLabel = {
              critical: "Critical",
              high: "High",
              moderate: "Mod.",
              low: "Low",
            };
            $("sentinelsGrid").innerHTML = devices.length
              ? devices
                  .map(function (d) {
                    var bl = d.batteryLevel || 0;
                    var r = deviceRisk(bl);
                    return (
                      '<div class="sentinel-card ' +
                      r +
                      '"><div class="sentinel-head"><span class="sentinel-id">' +
                      (d.deviceCode || "—") +
                      '</span><span class="sentinel-badge ' +
                      r +
                      '">' +
                      rLabel[r] +
                      '</span></div><div class="sentinel-body"><span class="sentinel-zone">' +
                      (d.status || "—") +
                      '</span><strong class="sentinel-eggs">' +
                      bl +
                      '<small>% batt</small></strong></div><div class="sentinel-bar ' +
                      r +
                      '" style="width:' +
                      bl +
                      '%"></div></div>'
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400 py-4 text-center">No devices.</p>';

            $("deviceTableBody").innerHTML = devices.length
              ? devices
                  .map(function (d) {
                    var batt = d.batteryLevel || 0;
                    var battClass =
                      batt < 20
                        ? "text-red-600"
                        : batt < 50
                          ? "text-amber-600"
                          : "text-emerald-600";
                    var statusClass =
                      d.status === "active"
                        ? "text-emerald-600"
                        : d.status === "needs_maintenance"
                          ? "text-amber-600"
                          : "text-slate-500";
                    return (
                      '<tr class="border-b border-slate-100 text-sm"><td class="py-2.5 pr-3 font-medium text-slate-800">' +
                      (d.deviceCode || "—") +
                      '</td><td class="py-2.5 pr-3"><span class="font-semibold ' +
                      statusClass +
                      '">' +
                      (d.status || "—") +
                      '</span></td><td class="py-2.5 pr-3"><span class="font-semibold ' +
                      battClass +
                      '">' +
                      batt +
                      '%</span></td><td class="py-2.5 pr-3 text-slate-500">' +
                      timeAgo(d.lastSeenAt) +
                      "</td></tr>"
                    );
                  })
                  .join("")
              : '<tr><td colspan="4" class="py-4 text-center text-sm text-slate-400">No devices found.</td></tr>';

            $("reportTableBody").innerHTML = reports.length
              ? reports
                  .map(function (r) {
                    var statusColors = {
                      submitted: "bg-slate-100 text-slate-600",
                      under_review: "bg-amber-50 text-amber-600",
                      scheduled_for_inspection: "bg-blue-50 text-blue-600",
                      checked: "bg-green-50 text-green-600",
                      closed: "bg-slate-100 text-slate-500",
                    };
                    var riskColors = {
                      high: "text-red-600",
                      medium: "text-amber-600",
                      low: "text-green-600",
                    };
                    return (
                      '<tr class="border-b border-slate-100 text-sm"><td class="py-2.5 pr-3 font-medium text-slate-800">#' +
                      r.id +
                      '</td><td class="py-2.5 pr-3 text-slate-600 max-w-xs truncate">' +
                      (r.description || "") +
                      '</td><td class="py-2.5 pr-3"><span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ' +
                      (statusColors[r.status] ||
                        "bg-slate-100 text-slate-600") +
                      '">' +
                      (r.status || "—").replace(/_/g, " ") +
                      '</span></td><td class="py-2.5 pr-3 font-semibold ' +
                      (riskColors[r.riskLevel] || "") +
                      '">' +
                      (r.riskLevel || "—") +
                      '</td><td class="py-2.5 pr-3 text-slate-500">' +
                      timeAgo(r.createdAt) +
                      "</td></tr>"
                    );
                  })
                  .join("")
              : '<tr><td colspan="5" class="py-4 text-center text-sm text-slate-400">No reports found.</td></tr>';

            var notifs = [];
            reports.forEach(function (r) {
              notifs.push({
                time: timeAgo(r.createdAt),
                label:
                  "Report #" +
                  r.id +
                  " (" +
                  r.riskLevel +
                  " risk): " +
                  (r.description || "").substring(0, 50),
                type: r.riskLevel === "high" ? "alert" : "report",
                ts: r.createdAt ? new Date(r.createdAt) : new Date(0),
              });
            });
            tasks.forEach(function (t) {
              notifs.push({
                time: timeAgo(t.createdAt),
                label:
                  "Task #" +
                  t.id +
                  ": " +
                  t.type.replace(/_/g, " ") +
                  " is " +
                  t.status,
                type: "task",
                ts: t.createdAt ? new Date(t.createdAt) : new Date(0),
              });
            });
            devices
              .filter(function (d) {
                return (d.batteryLevel || 100) < 30;
              })
              .forEach(function (d) {
                notifs.push({
                  time: "Now",
                  label:
                    d.deviceCode +
                    " battery low (" +
                    d.batteryLevel +
                    "%) — maintenance needed",
                  type: "alert",
                  ts: new Date(),
                });
              });
            notifs.sort(function (a, b) {
              return b.ts - a.ts;
            });
            $("notificationsList").innerHTML = notifs.length
              ? notifs
                  .slice(0, 20)
                  .map(function (n) {
                    return (
                      '<div class="activity-item"><div class="activity-dot ' +
                      n.type +
                      '"></div><div class="activity-content"><p class="activity-text">' +
                      n.label +
                      '</p><span class="activity-time">' +
                      n.time +
                      "</span></div></div>"
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400 py-4 text-center">No notifications.</p>';

            window._allUsers = allUsers;
            var inspectors = allUsers.filter(function (u) {
              return u.role === "inspector";
            });
            var inspectorTaskCounts = {};
            tasks.forEach(function (t) {
              if (t.assignedTo)
                inspectorTaskCounts[t.assignedTo] =
                  (inspectorTaskCounts[t.assignedTo] || 0) + 1;
            });
            $("inspectorsList").innerHTML = inspectors.length
              ? inspectors
                  .map(function (u) {
                    var taskCount = inspectorTaskCounts[u.id] || 0;
                    var status = taskCount > 0 ? "On Task" : "Available";
                    var statusClass =
                      taskCount > 0 ? "text-amber-600" : "text-emerald-600";
                    var initial = (u.name || "?").charAt(0).toUpperCase();
                    return (
                      '<div class="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0"><div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white">' +
                      initial +
                      '</div><div class="flex-1"><p class="font-semibold text-slate-800">' +
                      (u.name || "—") +
                      '</p><p class="text-xs text-slate-400">' +
                      (u.email || "—") +
                      '</p></div><span class="text-sm font-semibold ' +
                      statusClass +
                      '">' +
                      status +
                      '</span><span class="text-xs text-slate-400 mr-3">' +
                      taskCount +
                      ' tasks</span><div class="relative inspector-menu"><button class="inspector-dot-btn" onclick="toggleMenu(this)" data-id="' +
                      u.id +
                      '"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button><div class="inspector-dropdown hidden"><button onclick="changeInspector(' +
                      u.id +
                      ')">Change</button><button onclick="viewInspector(' +
                      u.id +
                      ')">View Full Information</button><button class="text-red-600" onclick="deleteInspector(' +
                      u.id +
                      ')">Delete/Remove</button></div></div></div>'
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400 text-center py-4">No inspectors found.</p>';

            var teamMembers = allUsers.filter(function (u) {
              return u.role === "treatment_team";
            });
            $("responseTeamList").innerHTML = teamMembers.length
              ? teamMembers
                  .map(function (u) {
                    var taskCount = inspectorTaskCounts[u.id] || 0;
                    var status = taskCount > 0 ? "On Task" : "Available";
                    var statusClass =
                      taskCount > 0 ? "text-amber-600" : "text-emerald-600";
                    var initial = (u.name || "?").charAt(0).toUpperCase();
                    return (
                      '<div class="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0"><div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-sm font-bold text-white">' +
                      initial +
                      '</div><div class="flex-1"><p class="font-semibold text-slate-800">' +
                      (u.name || "—") +
                      '</p><p class="text-xs text-slate-400">' +
                      (u.email || "—") +
                      '</p></div><span class="text-sm font-semibold ' +
                      statusClass +
                      '">' +
                      status +
                      '</span><span class="text-xs text-slate-400 mr-3">' +
                      taskCount +
                      ' tasks</span><div class="relative inspector-menu"><button class="inspector-dot-btn" onclick="toggleMenu(this)" data-id="' +
                      u.id +
                      '"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button><div class="inspector-dropdown hidden"><button onclick="changeInspector(' +
                      u.id +
                      ')">Change</button><button onclick="viewInspector(' +
                      u.id +
                      ')">View Full Information</button><button class="text-red-600" onclick="deleteInspector(' +
                      u.id +
                      ')">Delete/Remove</button></div></div></div>'
                    );
                  })
                  .join("")
              : '<p class="text-sm text-slate-400 text-center py-4">No response team members found.</p>';

            fillProfile(b ? b.name : null);
          })
          .catch(function (e) {
            console.warn("Failed to load data", e);
            $("dashboardMetrics").innerHTML =
              '<p class="text-sm text-slate-400 col-span-full text-center py-8">Unable to load dashboard data. Please try again.</p>';
          });
      }

      function renderOperationsBoardAndActivity() {
        if (typeof ops === "function") {
          ops([
            { label: "Active reports", value: "12" },
            { label: "Pending inspections", value: "4" },
            { label: "High-risk areas", value: "2" },
            { label: "Teams deployed", value: "2" },
            { label: "Tasks overdue", value: "1" },
            { label: "Response status", value: "Ongoing" },
          ]);
        }
        if (typeof activityFeed === "function") {
          activityFeed();
        }
      }

      renderOperationsBoardAndActivity();
      loadDashboard();
