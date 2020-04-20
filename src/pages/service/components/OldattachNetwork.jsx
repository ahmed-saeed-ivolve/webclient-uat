<Descriptions.Item span={3} label="Network">
  <>
    {assignOrReleaseNetwork === '' ? (
      <>
        {filteredFixedIPs !== null ? filteredFixedIPs.map(item => <Tag>{item}</Tag>) : '-'}
        <Dropdown overlay={networkMenu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            More <Icon type="down" />
          </a>
        </Dropdown>
      </>
    ) : (
      <>
        {assignOrReleaseNetwork === 'assign' ? (
          <>
            <Select
              loading={attachingNetwork || fetchingNetwork}
              disabled={attachingNetwork}
              showSearch
              style={{ width: 200 }}
              placeholder="Attach an IP"
              optionFilterProp="children"
              onChange={handleAssignNetwork}
              autoFocus={true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {vpc.list.length > 0 ? (
                vpc.list.map(items => <Option value={items.id}>{items.name}</Option>)
              ) : (
                <Option disabled={true} value={1}>
                  <Spin
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: '50px',
                      marginTop: '10px',
                    }}
                    indicator={antIcon}
                    size="large"
                  />
                </Option>
              )}
            </Select>
            <Button
              type="primary"
              style={{
                marginLeft: '10px',
                fontFamily: `Open Sans`,
                fontWeight: `600`,
                height: 'fit-content',
                padding: '0px 6px',
              }}
            >
              Assign
            </Button>
          </>
        ) : (
          <>
            <Select
              loading={attachingNetwork || fetchingNetwork}
              disabled={attachingNetwork}
              showSearch
              style={{ width: 200 }}
              placeholder="Attach an IP"
              optionFilterProp="children"
              onChange={handleAssignNetwork}
              autoFocus={true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {vpc.list.length > 0 ? (
                vpc.list.map(items => <Option value={items.id}>{items.name}</Option>)
              ) : (
                <Option disabled={true} value={1}>
                  <Spin
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: '50px',
                      marginTop: '10px',
                    }}
                    indicator={antIcon}
                    size="large"
                  />
                </Option>
              )}
            </Select>
            <Button
              type="primary"
              style={{
                marginLeft: '10px',
                fontFamily: `Open Sans`,
                fontWeight: `600`,
                height: 'fit-content',
                padding: '0px 6px',
              }}
            >
              Assign
            </Button>
          </>
        )}
        <Button
          style={{
            marginLeft: '10px',
            fontFamily: `Open Sans`,
            fontWeight: `600`,
            height: 'fit-content',
            padding: '0px 6px',
          }}
          onClick={() => assignNetwork('')}
        >
          Cancel
        </Button>
      </>
    )}
  </>
</Descriptions.Item>;
